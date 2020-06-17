const Sequelize     = require("sequelize");
const connection    = require("./database/database");
const Barcode       = require("./Barcodes");

const Sale = connection.define("sales", {
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Sale.belongsTo(Barcode);

// Sale.sync({force: true});
 
module.exports = Sale;