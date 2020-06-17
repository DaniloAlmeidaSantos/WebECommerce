const Sequelize     = require("sequelize");
const connection    = require("./database/database");
const Game          = require("./Games");

const Barcode = connection.define("barcodes", {
    barcode: {
        type: Sequelize.STRING,
        allowNull: false
    } 
});

Game.hasMany(Barcode);
Barcode.belongsTo(Game);

// Barcode.sync({force: true});

module.exports = Barcode;