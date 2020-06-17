// Initialize Sequelize
const Sequelize = require('sequelize');

// Config database connection
const connection = new Sequelize('nandogames', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    timezone: "-03:00"
});

module.exports = connection;