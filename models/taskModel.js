
const { readData, writeData } = require('../utils/storage');

// Laad taken uit opslag
let tasks = readData('tasks');

// Sla taken op in persistentie
const save = () => {
  writeData('tasks', tasks);
};

module.exports = {
  // Haal alle taken op
  get: () => tasks,

  // Voeg nieuwe taak toe
  add: (task) => {
    tasks.push(task);
    save();
    return task;
  },

   // Werk taak bij via updatefunctie
  update: (taskId, updateFn) => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = updateFn(tasks[index]); // Pas updatefunctie toe
      save();
      return tasks[index];
    }
    return null; // Geef null terug bij fout
  },
  // Verwijder taak op ID
  delete: (taskId) => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      const removed = tasks.splice(index, 1); // Verwijder 1 element op index
      save();
      return removed;
    }
    return null;  // Geef null terug bij fout
  },
  // Zoek taken op predikaatfunctie
  findBy: (predicate) => tasks.filter(predicate),
  // Opslagfunctie
  save
};