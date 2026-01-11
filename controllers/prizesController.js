
const prizesModel = require("../models/prizesModel");

/**
 * Toont beheerpagina voor prijzen (alleen voor ouders)
 * - Controleert gebruikersrol
 * - Haalt prijzen op voor huidige gezin
 */
exports.showPrizes = (req, res) => {
  const user = req.session.user;
  // Alleen ouders hebben toegang
  if (user.role !== "ouder") return res.status(403).send("Toegang geweigerd");
 // Haal prijzen op voor dit gezin
  const familyPrizes = prizesModel.getForFamily(user.familyId) || [];
  // Render beheerpagina
  res.render("prizesManage", { user, prizes: familyPrizes, title: "Prijzenlijst beheren" });
};
/**
 * Voegt nieuwe prijs toe (alleen voor ouders)
 * - Valideert invoer
 * - Zorgt voor correcte gegevenstypen
 */
exports.addPrize = (req, res) => {
  const user = req.session.user;
  // Rolcontrole
  if (user.role !== "ouder") {
    req.session.error = "Alleen ouders mogen prijzen toevoegen.";
    return res.redirect("/dashboard");
  }
// Valideer invoer
  const { name, cost } = req.body;
  if (!name || isNaN(cost) || cost <= 0) {
    req.session.error = "Voer een geldige naam en kosten in.";
    return res.redirect("/dashboard");
  }
// Voeg prijs toe aan model
  prizesModel.add(user.familyId, {
    id: Date.now(),// Unieke ID
    name: name.trim(), // Verwijder spaties
    cost: parseInt(cost) // Zorg voor numerieke waarde
  });
// Feedback voor gebruiker
  req.session.success = `Prijs "${name}" is toegevoegd.`;
  res.redirect("/dashboard");
};

/**
 * Bewerkt bestaande prijs (alleen voor ouders)
 * - Controleert indexvaliditeit
 * - Valideert nieuwe waarden
 */
exports.editPrize = (req, res) => {
  const user = req.session.user;
  // Rolcontrole
  if (user.role !== "ouder") {
    req.session.error = "Alleen ouders mogen prijzen bewerken.";
    return res.redirect("/dashboard");
  }

  const { index } = req.params;
  const { name, cost } = req.body;

  // Haal huidige prijzen op
  const familyPrizes = prizesModel.getForFamily(user.familyId);
   // Controleer of prijs bestaat
  if (!familyPrizes || !familyPrizes[index]) {
    req.session.error = "Prijs niet gevonden.";
    return res.redirect("/dashboard");
  }

  // Valideer nieuwe waarden
  if (!name || isNaN(cost) || cost <= 0) {
    req.session.error = "Voer een geldige naam en kosten in.";
    return res.redirect("/dashboard");
  }

  // Update prijs met behoud van andere eigenschappen
  prizesModel.update(user.familyId, index, {
    ...familyPrizes[index], // Behoud bestaande waarden
    name: name.trim(),
    cost: parseInt(cost)
  });
// Feedback voor gebruiker
  req.session.success = `Prijs is bijgewerkt.`;
  res.redirect("/dashboard");
};

/**
 * Verwijdert een prijs (alleen voor ouders)
 * - Controleert indexvaliditeit
 * - Geeft feedback over succes/verwijderde item
 */
exports.deletePrize = (req, res) => {
  const user = req.session.user;
  // Rolcontrole
  if (user.role !== "ouder") {
    req.session.error = "Alleen ouders mogen prijzen verwijderen.";
    return res.redirect("/dashboard");
  }

  const { index } = req.params;

  // Probeer prijs te verwijderen
  const removed = prizesModel.delete(user.familyId, index);
  
  // Controleer of verwijderen gelukt is
  if (!removed) {
    req.session.error = "Prijs niet gevonden.";
    return res.redirect("/dashboard");
  }

  // Feedback met naam van verwijderde prijs
  req.session.success = `Prijs "${removed[0].name}" is verwijderd.`;
  res.redirect("/dashboard");
};