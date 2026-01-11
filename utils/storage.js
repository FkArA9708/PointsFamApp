const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data');

const readData = (file) => {
  try {
    
    const filePath = path.join(DATA_PATH, `${file}.json`);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

const writeData = (file, data) => {
  const filePath = path.join(DATA_PATH, `${file}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = { readData, writeData };