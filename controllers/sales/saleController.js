const express       = require("express");
const router        = express.Router();
const adminAuth     = require("../../middlewares/adminAuth");
const Barcode       = require("../../Models/Barcodes");
const Sale          = require("../../Models/Sales");
const Game          = require("../../Models/Games");

router.get("/admin/sales", adminAuth, (req, res) => {
    Sale.findAll({
        include: [{model: Barcode}],
        limit: 30
    }).then(sales => {
        res.render("admin/sales/index", {sales: sales});
    })
});

router.get("/sale/game/:id", adminAuth, (req, res) => {
    var id = req.params.id;

    Game.findOne(
        {
            where: {id: id}
        }
    ).then(game => {
        res.render("admin/sales/sale", {game: game});
    }).catch(() => {
        res.redirect("/admin/games");
    });
});

router.get("/sale/edit/status/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    Sale.findByPk(id).then(status => {
        res.render("admin/sales/edit", {status: status});
    })
});

router.post("/sale/game", adminAuth, (req, res) => {
    var status  = "VENDIDO";
    var gameId  = req.body.gameId;
    var title   = req.body.title;
    var barcode = req.body.barcode;

    
    Barcode.findOne({where: {id: barcode, gameId: gameId}}).then(code => {
        Sale.create({
            status: status,
            title: title,
            barcodeId: barcode
        }).then(() => {
            Barcode.destroy({where: {id: code.id}}).then(() => {
                Game.query("UPDATE games SET stock = stock - 1 WHERE id = " + code.gameId).then(() => {
                    res.redirect("/admin/sales");
                });
            });
        }).catch(err => {
            
        });
    }).catch(err => {
        res.render("error", {message: "Produto não cadastrado!", link: "/admin/games", user: true});
    })
});

router.post("/sales/update", adminAuth, (req, res) => {
    var status = req.body.status;
    Sale.update({status: status}).then(() => {
        res.redirect("/admin/sales");
    })
});

router.get("/sales/page/:num", adminAuth, (req, res) => {
    var page    = req.params.num;
    var offset  = 0;

    if (isNaN(page)) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * 30;
    }

    Sale.findAndCountAll(
        {
            include: [{model: Barcode}],
            limit: 30,
            offset: offset
        }
    ).then(sales => {
        var next;

        if (offset + 30 >= sales.count) {
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            sales: sales
        }

        if (result) {
            res.render("admin/games/page", {result: result});   
        }
    })
});

module.exports = router;