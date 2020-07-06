/* Seach Games in page for users */
const express       = require("express");
const router        = express.Router();
const Category      = require("../../Models/Category");
const Game          = require("../../Models/Games");
const Sequelize     = require("sequelize");
const Op            = Sequelize.Op;

router.post("/users/search/games", (req, res) => {
    var search   = req.body.search;

    if (search != undefined) {
        Game.findAll(
            {
                where: {
                    title: {
                        [Op.like]: `%${search}%`
                    }
                }
            }
        ).then(games => {
            var game = games;
        });

        Category.findAll(
            {
                where: {
                    title: {
                        [Op.like]: `%${search}%`
                    }
                }
            }
        ).then(categories => {
            var category = categories;
        });

        if (game) {    
            if (category) {
                res.render("utils/search", {game: game, category: category});
            } else {
                res.render("utils/search", {game: game});
            }
        } else {
            if (req.user) {
                res.render("error", {message: "Sem resultados de sua pesquisa!", link: "/", user: true});
            } else {
                res.render("error", {message: "Sem resultados de sua pesquisa!", link: "/", user: false});
            }
        }
    } else {
        res.redirect("/admin/games")
    }
});