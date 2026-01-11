
const { readData, writeData } = require('../utils/storage');
const bcrypt = require('bcrypt');

// Laad gebruikers uit opslag of initialiseer lege array
let users = readData('users') || [];

// Sla gebruikers op in persistentie
const save = () => {
  writeData('users', users);
};

module.exports = {
  // Haal alle gebruikers op
  get: () => users,
  // Voeg nieuwe gebruiker toe (met wachtwoordhashing)
  add: (user) => {
    user.password = bcrypt.hashSync(user.password, 10); // Hash wachtwoord
    users.push(user);
    save();
  },
   // Zoek gebruiker op gebruikersnaam
  findByUsername: (username) => {
    return users.find(u => u.username === username) || null;
  },
  // Haal gezinsleden op per familie-ID
  getFamilyMembers: (familyId) => users.filter(u => u.familyId === familyId),
   // Werk gebruiker bij via updatefunctie
  update: (username, updateFn) => {
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
      users[index] = updateFn({...users[index]}); // Kopieer object voor onveranderlijkheid
      save();
      return users[index];
    }
    return null; // Geef null terug bij fout
  },
  // Haal unieke familie-IDs op
  getFamilies: () => {
    const families = new Set();// Gebruik Set voor unieke waarden
    users.forEach(user => families.add(user.familyId));
    return Array.from(families);// Converteer naar array
  }
};