
const { readData, writeData } = require('../utils/storage');

// Laad berichten uit opslag of initialiseer lege array
let messages = readData('messages') || [];

// Sla berichten op in persistentie
const save = () => {
  writeData('messages', messages);
};

module.exports = {
  

  /**
 * Haal berichten op voor specifieke gebruiker
 * - Intra-gezin: Alle berichten binnen gezin
 * - Cross-family: Alleen voor ouders, berichten van/naar hun gezin
 * - Sorteert op timestamp (nieuwste eerst)
 */
getForUser: (familyId, username, role) => {
  return messages.filter(msg => {
    
    if (msg.familyId === familyId) {
      return (msg.to === username || msg.from === username || !msg.to);
    }
    
    // Cross-family berichten (alleen voor ouders)
    if (role === 'ouder' && 
        (msg.fromFamily === familyId || msg.toFamily === familyId)) {
      return true;
    }
    return false;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));// Nieuwste eerst
},
 // Voeg nieuw bericht toe
  add: (message) => {
    messages.push(message);
    save();
    return message;
  },
  // Hulpfunctie voor testdoeleinden
  getFamilyMembersMessages: (familyId) => {
    return messages.filter(msg => msg.familyId === familyId);
  },
  save
};

// (niet geexporteerd) hulpfunctie voor cross-family berichten
getForCrossFamily: (senderFamilyId, recipientFamilyId) => {
  return messages.filter(msg => 
    (msg.familyId === senderFamilyId && msg.recipientFamilyId === recipientFamilyId) ||
    (msg.familyId === recipientFamilyId && msg.recipientFamilyId === senderFamilyId)
  );
}