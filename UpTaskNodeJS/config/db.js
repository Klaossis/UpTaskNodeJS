const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const db = new Sequelize('uptasknode', 'root', '929470706787aA', {
  host: '127.8.8.1',
  dialect: 'mysql'
});

module.exports = db;