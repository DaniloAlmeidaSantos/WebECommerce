// Initialize Sequelize
const Sequelize = require('sequelize');

// Config database connection
const connection = new Sequelize('nandogames', 'daniloalmeida', 'nando2020', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00",

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
    
      // SQLite only
      storage: 'path/to/database.sqlite',
    
      // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
      operatorsAliases: false
});

module.exports = connection;