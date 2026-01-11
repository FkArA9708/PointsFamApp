
const userModel = require("../models/userModel");
const messagesModel = require("../models/messagesModel");
const auth = require("../middleware/auth");

/**
 * Toon berichtencentrum met gefilterde berichten
 * - Haalt gezinsleden op voor ontvangerslijst
 * - Toont cross-family opties alleen voor ouders
 * - Verwijdert sessiemeldingen na weergave
 */

exports.showMessages = (req, res) => {
  const user = req.session.user;

  // Haal alle familieleden op voor het huidige gezin
  const familyMembers = userModel.getFamilyMembers(user.familyId);

  // Filter andere families (voor cross-family communicatie)
  const otherFamilies = userModel.getFamilies().filter(f => f !== user.familyId);
  
  // Ontvangerslijst: alle gezinsleden behalve de huidige gebruiker
  const recipients = familyMembers.filter(member => member.username !== user.username);
  
  // Haal relevante berichten op voor deze gebruiker
  const userMessages = messagesModel.getForUser(user.familyId, user.username, user.role);
  
  // Render de berichtenpagina met alle benodigde data
  res.render("messages", {
    title: "Berichtencentrum",
    user,
    messages: userMessages,
    familyMembers: recipients,
    otherFamilies,
    success: req.session.success,
    error: req.session.error
  });
  
  // Reset sessiemeldingen na weergave
  delete req.session.success;
  delete req.session.error;
};

/**
 * Verstuur bericht naar ander gezin
 * - Alleen toegankelijk voor ouders
 * - Valideert berichtinhoud
 * - Voegt metadata toe (timestamp, afzender)
 */

exports.sendCrossFamilyMessage = (req, res) => {
  const { toFamily, message } = req.body;
  const user = req.session.user;

  // Controleer of gebruiker een ouder is
  if (req.session.user?.role !== 'ouder') {
    req.session.error = "Alleen ouders hebben toegang tot deze functie";
    return res.redirect('/messages');
  }
  
  // Valideer berichtinhoud
  if (!message.trim()) {
    req.session.error = "Bericht mag niet leeg zijn";
    return res.redirect("/messages");
  }
// Maak nieuw berichtobject met metadata
  const newMessage = {
    id: Date.now(),// Unieke ID gebaseerd op timestamp
    from: user.username,
    fromFamily: user.familyId,
    toFamily,
    message: message.trim(),// Verwijder overbodige spaties
    timestamp: new Date().toISOString() // ISO-formaat voor consistentie
  };

// Voeg bericht toe aan model en sla op
  messagesModel.add(newMessage);

  // Feedback voor gebruiker
  req.session.success = "Bericht verstuurd naar andere familie!";
  res.redirect("/messages");
};
/**
 * Verstuurt een bericht binnen het eigen gezin
 * - Ondersteunt berichten naar individuen of hele gezin
 * - Valideert berichtinhoud
 * - Voegt metadata toe
 */
exports.sendMessage = (req, res) => {
  const { to, message } = req.body;
  const user = req.session.user;
  
  // Valideer berichtinhoud
  if (!message.trim()) {
    req.session.error = "Bericht mag niet leeg zijn";
    return res.redirect("/messages");
  }
// Maak nieuw berichtobject
  const newMessage = {
    id: Date.now(),
    from: user.username,
    to: to === 'family' ? null : to,
    familyId: user.familyId,
    message: message.trim(),
    timestamp: new Date().toISOString()
  };
// Voeg toe aan opslag
  messagesModel.add(newMessage);

  // Feedback voor gebruiker
  req.session.success = "Bericht verstuurd!";
  res.redirect("/messages");
};