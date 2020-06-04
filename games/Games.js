const Sequelize     = require("sequelize");
const connection    = require("../database/database");
const Category      = require("../categories/Category");

const Game = connection.define("games", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    },
    link: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    indicated: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Category.hasMany(Game);
Game.belongsTo(Category);

Game.sync({force: true});

module.exports = Game;