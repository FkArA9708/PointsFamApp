const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const prizesModel = require("../models/prizesModel");

/**
 * Dashboard hoofdweergave
 * - Toont verschillende inhoud voor ouders/kinderen
 * - Filtert zichtbare taken op rol
 * - Toont gepersonaliseerde prijzenlijst
 * - Verwerkt sessiemeldingen
 */

exports.dashboard = (req, res) => {
  const user = req.session.user;
  // Controleer of gebruiker is ingelogd
  if (!user) {
    req.session.error = "Je moet ingelogd zijn om het dashboard te bekijken.";
    return res.redirect("/login");
  }
// Haal gebruikersdata op
  const currentUserData = userModel.findByUsername(user.username);

  // Haal gezinsleden op
  const familyUsers = userModel.getFamilyMembers(user.familyId);

  // Filter kinderen in het gezin
  const familyChildUsers = familyUsers.filter(u => u.role === "kind");

  // Maak puntenoverzicht voor kinderen
  const familyChildren = familyChildUsers.map(child => ({
    username: child.username,
    points: child.points || 0
  }));
// Filter zichtbare taken op basis van rol
  let visibleTasks = [];
  if (user.role === "kind") {
    // Kinderen zien alleen hun eigen taken
    visibleTasks = taskModel.findBy(task => task.assignedTo === user.username);
  } else {
    // Ouders zien taken van alle kinderen in het gezin
    visibleTasks = taskModel.findBy(task => 
      familyChildUsers.some(child => child.username === task.assignedTo)
    );
  }

  // Haal prijzen voor dit gezin op
  const familyPrizes = prizesModel.getForFamily(user.familyId) || [];
  

 // Haal sessiemeldingen op
  const successMessage = req.session.success || null;
  const errorMessage = req.session.error || null;

  // Verzamel verzilverde prijzen (alleen voor ouders)
  let redeemedPrizes = [];
  if (user.role === "ouder") {
    redeemedPrizes = familyUsers
      .filter(u => u.role === "kind" && Array.isArray(u.redeemedPrizes))
      .map(u => ({ username: u.username, prizes: u.redeemedPrizes }));
  }

  // Filter prijzen voor kinderen (verberg al verzilverde)
  let filteredPrizes = familyPrizes;
  if (user.role === "kind") {
    const redeemed = currentUserData.redeemedPrizes || [];
    filteredPrizes = familyPrizes.filter(p => !redeemed.some(r => r.name === p.name));
  }

  // Reset sessiemeldingen
  delete req.session.success;
  delete req.session.error;

   // Render dashboard met alle data
  res.render("dashboard", {
    title: "Dashboard",
    user,
    tasks: visibleTasks,
    prizes: filteredPrizes,
    points: currentUserData.points || 0,
    childPoints: familyChildren,
    familyChildren: familyChildUsers,
    error: errorMessage,
    success: successMessage,
    redeemedPrizes: redeemedPrizes
  });
};

/**
 * Voegt nieuwe taak toe (alleen voor ouders)
 * - Valideert invoer
 * - Controleert of toegewezen gebruiker bestaat en kind is
 */
exports.addTask = (req, res) => {
  const { title, points, assignedTo, type, date } = req.body;
  const user = req.session.user;

  // Bereid takenlijst voor op foutafhandeling
  let visibleTasks;
  if (user.role === "kind") {
    visibleTasks = taskModel.findBy(task => task.assignedTo === user.username);
  } else {
    const familyChildUsernames = userModel.getFamilyMembers(user.familyId)
      .filter(u => u.role === "kind")
      .map(u => u.username);
    visibleTasks = taskModel.findBy(task => familyChildUsernames.includes(task.assignedTo));
  }

  const familyChildUsers = userModel.getFamilyMembers(user.familyId)
    .filter(u => u.role === "kind");

    // Valideer invoer
  if (!title || isNaN(points) || points <= 0) {
    return res.render("dashboard", {
      title: "Dashboard",
      user,
      tasks: visibleTasks,
      prizes: prizesModel.get() || [],
      points: user.points || 0,
      error: "Voer een geldige taaknaam en een positief aantal punten in.",
      childPoints: user.role === "ouder"
        ? familyChildUsers.map(u => ({ username: u.username, points: u.points || 0 }))
        : []
    });
  }
// Controleer of toegewezen gebruiker bestaat en kind is
  const assignedUser = userModel.findByUsername(assignedTo);
  if (!assignedUser || assignedUser.role !== 'kind' || assignedUser.familyId !== user.familyId) {
    return res.render("dashboard", {
      title: "Dashboard",
      user,
      tasks: visibleTasks,
      prizes: prizesModel.get() || [],
      points: user.points || 0,
      error: `Gebruiker "${assignedTo}" bestaat niet of is geen kind in jouw familie.`,
      childPoints: familyChildUsers.map(u => ({ username: u.username, points: u.points || 0 }))
    });
  }
// Voeg taak toe
  taskModel.add({
    id: Date.now(),
    title: title.trim(),
    points: parseInt(points),
    assignedTo,
    type: type || "standaard", // Default naar standaardtype
    date: date || null, // Optionele deadline
    done: false,
    approved: false
  });
// Feedback voor gebruiker
  req.session.success = "Taak succesvol toegevoegd!";
  res.redirect("/dashboard");
};
/**
 * Markeert taak als voltooid (alleen voor kinderen)
 * - Controleert taakeigendom
 * - Werkt taakstatus bij
 */

exports.completeTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = taskModel.get().find(t => t.id === taskId);
  
  // Controleer of taak bestaat
  if (!task) {
    req.session.error = "Taak niet gevonden.";
    return res.redirect("/dashboard");
  }

  const user = req.session.user;

  // Kinderen mogen alleen hun eigen taken markeren
  if (user.role === "kind" && task.assignedTo !== user.username) {
    req.session.error = "Je mag alleen je eigen taken markeren als voltooid.";
    return res.redirect("/dashboard");
  }
// Update taakstatus
  taskModel.update(taskId, (t) => {
    t.done = true;
    return t;
  });
// Feedback voor gebruiker
  req.session.success = `Taak "${task.title}" is gemarkeerd als voltooid.`;
  res.redirect("/dashboard");
};

/**
 * Keurt voltooide taak goed (alleen voor ouders)
 * - Controleert taakstatus
 * - Kent punten toe aan kind
 */
exports.approveTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = taskModel.get().find(t => t.id === taskId);
  
  // Controleer of taak bestaat
  if (!task) {
    req.session.error = "Taak niet gevonden.";
    return res.redirect("/dashboard");
  }
  
  // Taak moet eerst voltooid zijn
  if (!task.done) {
    req.session.error = "Taak moet eerst voltooid zijn voordat deze goedgekeurd kan worden.";
    return res.redirect("/dashboard");
  }
   // Controleer of taak al is goedgekeurd
  if (task.approved) {
    req.session.error = "Taak is al goedgekeurd.";
    return res.redirect("/dashboard");
  }
// Markeer taak als goedgekeurd
  taskModel.update(taskId, (t) => {
    t.approved = true;
    return t;
  });
// Voeg punten toe aan kind
  const user = userModel.findByUsername(task.assignedTo);
  if (user) {
    userModel.update(user.username, (u) => {
      u.points = (u.points || 0) + task.points;
      return u;
    });
  }
// Feedback voor gebruiker
  req.session.success = `Taak "${task.title}" is goedgekeurd en punten toegekend aan ${task.assignedTo}.`;
  res.redirect("/dashboard");
};

/**
 * Toont bewerkingsformulier voor taak
 * - Valideert taak-ID
 */
exports.showEditTaskForm = (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = taskModel.get().find(t => t.id === taskId);
  
  // Controleer of taak bestaat
  if (!task) {
    return res.status(404).send("Taak niet gevonden");
  }
  // Render bewerkingspagina
  res.render("editTask", {
    title: "Taak bewerken",
    user: req.session.user,
    task
  });
};

/**
 * Werkt taak bij
 * - Reset goedkeuringsstatus na wijziging
 */
exports.editTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title } = req.body;

  // Zoek taak in opslag
  const task = taskModel.get().find(t => t.id === taskId);
  if (!task) {
    req.session.error = "Taak niet gevonden.";
    return res.redirect("/dashboard");
  }
// Update taak met nieuwe waarden
  taskModel.update(taskId, (t) => {
    t.title = title.trim();
    t.done = false; // Reset voltooi-status
    t.approved = false; // Reset goedkeuringsstatus
    return t;
  });

  // Feedback voor gebruiker
  req.session.success = `Taak "${title}" is succesvol bijgewerkt.`;
  res.redirect("/dashboard");
};

/**
 * Verwijdert een taak
 * - Geeft feedback over succes
 */
exports.deleteTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const deleted = taskModel.delete(taskId);
  
  // Geef feedback op basis van resultaat
  if (deleted) {
    req.session.success = "Taak verwijderd!";
  } else {
    req.session.error = "Taak niet gevonden";
  }
  
  res.redirect("/dashboard");
};
/**
 * Toont prijzenpagina
 * - Toont beschikbare prijzen
 * - Reset sessiemeldingen
 */
exports.showPrizes = (req, res) => {
  const user = req.session.user;
  const familyPrizes = prizesModel.getForFamily(user.familyId) || [];
  
  // Render prijzenpagina
  res.render("prizes", {
    title: "Prijzen",
    user: user,
    prizes: familyPrizes,
    success: req.session.success || null,
    error: req.session.error || null
  });
 // Reset meldingen
  delete req.session.success;
  delete req.session.error;
};

/**
 * Verzilver een prijs
 * - Controleert beschikbare punten
 * - Werkt gebruikerspunten bij
 * - Voegt toe aan verzilverde prijzen historie
 * - Toepasselijke feedback naar gebruiker
 */

exports.redeemPrize = (req, res) => {
  const { prizeId } = req.body;
  const user = req.session.user;
  
  // Haal prijzen voor dit gezin op
  const familyPrizes = prizesModel.getForFamily(user.familyId) || [];

  // Zoek geselecteerde prijs
  const prize = familyPrizes.find(p => p.id === parseInt(prizeId));
  
  // Controleer of prijs bestaat
  if (!prize) {
    req.session.error = "Prijs niet gevonden.";
    return res.redirect("/prizes");
  }

  // Haal gebruikersdata op
  const dbUser = userModel.findByUsername(user.username);

  // Alleen kinderen kunnen prijzen verzilveren
  if (!dbUser || dbUser.role !== "kind") {
    req.session.error = "Alleen kinderen kunnen prijzen kiezen.";
    return res.redirect("/prizes");
  }

  // Controleer of gebruiker genoeg punten heeft
  if ((dbUser.points || 0) < prize.cost) {
    req.session.error = "Je hebt niet genoeg punten voor deze prijs.";
    return res.redirect("/prizes");
  }

  // Werk gebruikersdata bij
  userModel.update(dbUser.username, (u) => {
    u.points -= prize.cost; // Trek punten af
    u.redeemedPrizes = u.redeemedPrizes || []; // Initialiseer indien nodig

    // Voeg toe aan verzilverde prijzen
    u.redeemedPrizes.push({ 
      ...prize, // Kopieer alle prijseigenschappen
      date: new Date().toISOString().split('T')[0] // Huidige datum (YYYY-MM-DD)
    });
    return u;
  });
 // Feedback voor gebruiker
  req.session.success = `Je hebt "${prize.name}" gekozen! Je punten zijn aangepast.`;
  res.redirect("/dashboard");
};