// models/prizesModel.js
const { readData, writeData } = require('../utils/storage');

// Laad prijzen uit opslag of initialiseer leeg object
let prizes = readData('prizes') || {};

// Sla prijzen op in persistentie
const save = () => {
  writeData('prizes', prizes);
};

module.exports = {
  // Haal prijzen op voor specifiek gezin
  getForFamily: (familyId) => prizes[familyId] || [],
  // Voeg nieuwe prijs toe aan gezin
  add: (familyId, prize) => {
    if (!prizes[familyId]) prizes[familyId] = []; // Initialiseer array indien nodig
    prizes[familyId].push(prize);
    save();
  },
  // Werk bestaande prijs bij op index
  update: (familyId, index, prize) => {
    if (prizes[familyId] && prizes[familyId][index]) {
      prizes[familyId][index] = prize;
      save();
      return prize;
    }
    return null; // Geef null terug bij fout
  },
  // Verwijder prijs op index
  delete: (familyId, index) => {
    if (prizes[familyId] && prizes[familyId][index]) {
      const removed = prizes[familyId].splice(index, 1); // Verwijder 1 element op index
      save();
      return removed;
    }
    return null; // Geef null terug bij fout
  },
  // Opslagfunctie
  save 
};