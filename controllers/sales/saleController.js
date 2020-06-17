const express       = require("express");
const router        = express.Router();
const adminAuth     = require("../../Models/Sales");
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

    Barcode.findOne(
        {
            where: {gameId: id},
            include: [{model: Game}]
        }
    ).then(game => {
        res.render("admin/sales/sale", {game: game});
    })
});

router.post("/sale/game", adminAuth, (req, res) => {
    var title   = req.body.title;
    var Barcode = req.body.barcode;

    Sales.create({
        status: "VENDIDO",
        title: title,
        barcodeId: barcode
    }).then(() => {
        Barcode.findOne({where: {id: barcode}}).then(game => {
            Barcode.destroy({where: {id: barcode}}).then(() => {
                Game.query("UPDATE games SET stock = stock - 1 WHERE id = " + game.gameId).then(() => {
                    res.redirect("/admin/sales");
                });
            });
        })
        
    }).catch(err => {
        
    })
});

module.exports = router;