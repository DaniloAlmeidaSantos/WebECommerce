const Sequelize = require('sequelize');

const connection = new Sequelize('nandogames', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    timezone: "-03:00"
});

module.exports = connection;