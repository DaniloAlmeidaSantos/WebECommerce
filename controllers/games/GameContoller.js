const express       = require("express");
const router        = express.Router();
const adminAuth     = require("../../middlewares/adminAuth");
const Category      = require("../../Models/Category");
const Game          = require("../../Models/Games");
const Barcode       = require("../../Models/Barcodes");
const Sequelize     = require("sequelize");
const Op            = Sequelize.Op;
const slugify       = require("slugify");
const multer        = require("../../middlewares/multer");


router.get("/admin/games", adminAuth,  (req, res) => {
    Game.findAll({
        include: [{model: Category}],
        limit: 30
    }).then(games => {
        res.render("admin/games/index", {games: games});
    });
});

router.get("/admin/games/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/games/new", {categories: categories});
    })
});

router.get("/admin/games/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;

    Game.findByPk(id).then(game => {
        if (game != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/games/edit", {game: game, categories: categories});
            })
        } else {
            res.redirect("/admin/games");    
        }
    }).catch(err => {
        res.redirect("/admin/games");
    })
});

router.post("/games/create", multer.single('image'), adminAuth, (req, res, next) => {
    if (req.file) {
        var title       = req.body.title;
        var price       = req.body.price;
        var url         = req.body.url;
        var desc        = req.body.desc;
        var category    = req.body.category;
        var stock       = req.body.stock;
        var indicated   = req.body.indicated;
        var barcode     = req.body.barcode;
        
        if (title != undefined && price != undefined) {
            Game.create({
                title: title,
                slug: slugify(title),
                price: parseFloat(price),
                image: req.file.filename,
                link: url,
                description: desc,
                categoryId: category,
                stock: stock,
                indicated: indicated
            }).then(() => {
                Game.findOne({order: [['id', 'Desc']]}).then(id => {
                    Barcode.create({barcode: barcode, gameId: id.id}).then(() => {
                        res.redirect("/admin/games");
                    })
                });
            }).catch(err => {
                res.redirect("/admin/games/new");
            });
        } else {
            res.redirect("/admin/games/new");
        }
    } else {
        res.redirect("/admin/games/new");
    }
});

router.post("/games/update", adminAuth, (req, res, next) => {
    var id          = req.body.id;
    var title       = req.body.title;
    var price       = req.body.price;
    var url         = req.body.url;
    var desc        = req.body.desc;
    var category    = req.body.category;
    var stock       = req.body.stock;
    var indicated   = req.body.indicated;
    
    if (title != undefined && price != undefined) {
        Game.update(
            {
                title: title,
                price: parseFloat(price),
                slug: slugify(title),
                link: url,
                description: desc,
                categoryId: category,
                stock: stock,
                indicated: indicated
            },
            {
                where: {id: id}
            }
        ).then(() => {
            res.redirect("/admin/games");
        })
    } else {
        res.redirect("/admin/agames/new");
    }
});

router.get("/games/update/image/:id", adminAuth, (req, res) => {
    var id = req.params.id;

    Game.findByPk(id).then(game => {
        res.render("admin/games/editImage", {game: game});
    }).catch(err => {
        res.redirect("/admin/games");
    })
});

router.post("/games/update/image", adminAuth, multer.single("image"), (req, res) => {
    var id = req.body.id;

    if (req.file) {
        Game.update(
            {
                image: req.file.filename
            }, 
            {
                where: { id: id }
            }
        ).then(() => {
            res.redirect("/admin/games");
        })
    } else {
        res.redirect("/admin/games");
    }
})

router.post("/game/delete", adminAuth, (req, res) => {
    var id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            Game.destroy({where: {id: id}}).then(() => {
                res.redirect("/admin/games");
            })
        } else {
            res.redirect("/admin/games");
        }
    } else {
        res.redirect("/admin/games");
    }
});

router.post("/game/search", adminAuth, (req, res) => {
    var title   = req.body.search;

    if (title != undefined) {
        Game.findAll(
            {
                where: {
                    title: {
                        [Op.like]: `%${title}%`
                    }
                }
            }
        ).then(games => {
            res.render("admin/games/search", {games: games});
        }).catch(err => {
            res.send(err);
        })
    } else {
        res.redirect("/admin/games")
    }
});

router.get("/games/page/:num", adminAuth, (req, res) => {
    var page    = req.params.num;
    var offset  = 0;

    if (isNaN(page)) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * 30;
    }

    Game.findAndCountAll(
        {
	        include: [{model: Category}],
            limit: 30,
            offset: offset
        }
    ).then(games => {
        var next;

        if (offset + 30 >= games.count) {
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            games: games
        }

        if (result) {
            res.render("admin/games/page", {result: result});   
        }
    })
});

module.exports = router;