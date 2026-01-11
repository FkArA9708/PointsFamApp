
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt"); 

/**
 * Toont inlogscherm
 * - Reset eventuele gebruikerssessie
 */
exports.showLogin = (req, res) => {
  res.render("login", {
    user: req.session.user,
    tasks: [],
    title: "Login",
    error: null,
  });
};

/**
 * Verwerkt inlogpoging
 * - Controleert gebruikersnaam, wachtwoord en rol
 * - Gebruikt bcrypt voor wachtwoordvergelijking
 * - Start sessie bij succes
 */
exports.login = (req, res) => {
  const { username, password, role } = req.body;
  console.log(`Login attempt: ${username}, role: ${role}`);
  
  // Zoek gebruiker in database
  const user = userModel.findByUsername(username);

  // Controleer of gebruiker bestaat
  if (!user) {
    console.log(`User not found: ${username}`);
    return res.render("login", {
      error: "Ongeldige gebruikersnaam of wachtwoord",
      title: "Login",
      user: null,
    });
  }
  
    // Controleer rolovereenkomst
  if (user.role !== role) {
    console.log(`Role mismatch: expected ${user.role}, got ${role}`);
    return res.render("login", {
      error: "Ongeldige gebruikersnaam of wachtwoord",
      title: "Login",
      user: null,
    });
  }

  // Vergelijk wachtwoord met bcrypt
  const passwordMatch = bcrypt.compareSync(password, user.password);

  // Controleer wachtwoord
  if (!passwordMatch) {
    console.log(`Password mismatch for user: ${username}`);
    return res.render("login", {
      error: "Ongeldige gebruikersnaam of wachtwoord",
      title: "Login",
      user: null,
    });
  }

  // Succesvolle login
  console.log(`Login successful: ${username}, role: ${role}`);

  // Sla gebruiker op in sessie
  req.session.user = {
    username,
    role,
    familyId: user.familyId,
    points: user.points
  };
// Redirect naar dashboard
 res.redirect("/dashboard");
};

/**
 * Middleware voor authenticatiecontrole
 * - Verzekert dat gebruiker is ingelogd
 * - Redirect naar login bij niet-authenticatie
 */
exports.ensureAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect("/");
  next();
};

/**
 * Voegt punten toe aan kind
 * - Controleert of doelgebruiker kind is in hetzelfde gezin
 * - Werkt puntenbalans bij
 */
exports.addPoints = (req, res) => {
  const { username, points, reason } = req.body;
  const currentUser = req.session.user;
  // Controleer of gebruiker is ingelogd
  if (!currentUser) {
    req.session.error = "Je moet ingelogd zijn om punten toe te voegen.";
    return res.redirect("/dashboard");
  }
// Zoek kind in database
  const child = userModel.get().find(
    (u) => u.username === username && u.role === "kind" && u.familyId === currentUser.familyId
  );
// Controleer of kind bestaat en in hetzelfde gezin zit
  if (!child) {
    req.session.error = `Je kunt geen punten geven aan ${username}, omdat dit kind niet in jouw familie zit.`;
    return res.redirect("/dashboard");
  }
// Werk punten bij
  userModel.update(child.username, (u) => {
    u.points = (u.points || 0) + parseInt(points);
    return u;
  });
// Log reden (voor debugging/dashboard)
  console.log(`Reden: ${reason}`);
  // Feedback voor gebruiker
  req.session.success = `Je hebt ${points} punten toegekend aan ${username}.`;
  res.redirect("/dashboard");
};
