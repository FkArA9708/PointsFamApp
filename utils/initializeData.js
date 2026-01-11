
const { readData, writeData } = require('./storage'); 
const bcrypt = require('bcrypt');

module.exports = function initializeData() {
  const users = [
    { username: "ouder1", role: "ouder", password: "ouder123", familyId: "famA" },
    { username: "ouder2", role: "ouder", password: "ouder123", familyId: "famA" },
    { username: "kind1", role: "kind", password: "kind123", points: 50, familyId: "famA", redeemedPrizes: [] },
    { username: "kind2", role: "kind", password: "kind123", points: 0, familyId: "famA", redeemedPrizes: [] },
    { username: "ouder3", role: "ouder", password: "ouder456", familyId: "famB" },
    { username: "kind3", role: "kind", password: "kind456", points: 0, familyId: "famB", redeemedPrizes: [] }
  ];

  const hashedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 10)
  }));

  const tasks = [
    {
      id: 1,
      title: "Kamer opruimen",
      points: 50,
      assignedTo: "kind1",
      type: "standaard",
      date: null,
      done: false,
      approved: false
    }
  ];

  const prizes = {
    famA: [
      { id: 1, name: "Kies wat we eten", cost: 500 },
      { id: 2, name: "Extra schermtijd", cost: 300 }
    ],
    famB: [
      { id: 1, name: "Kies wat we eten", cost: 500 },
      { id: 2, name: "Extra schermtijd", cost: 300 }
    ]
  };

if (!readData('users')) {
    writeData('users', hashedUsers);
    console.log("✅ Users initialized");
  }
  
  if (!readData('tasks')) {
    writeData('tasks', tasks);
    console.log("✅ Tasks initialized");
  }
  
  if (!readData('prizes')) {
    writeData('prizes', prizes);
    console.log("✅ Prizes initialized");
  }

  console.log("✅ Data initialization completed");
};