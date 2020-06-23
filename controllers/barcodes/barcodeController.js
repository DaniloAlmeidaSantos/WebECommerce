const express       = require("express");
const router        = express.Router();
const Barcode       = require("../../Models/Barcodes");
const Game          = require("../../Models/Games");
const adminAuth     = require("../../middlewares/adminAuth");

router.get("/admin/barcode", adminAuth, (req, res) => {
    Barcode.findAll().then(barcode => {
        res.render("admin/barcodes/index", {barcode: barcode})
    })
});

router.get("/admin/barcode/new", adminAuth, (req, res) => {
    Game.findAll().then(games => {
        res.render("admin/barcodes/new", {games: games}) 
    })
});

router.get("/admin/barcode/search/:barcode", adminAuth, (req, res) => {
    var code = req.params.barcode;

    Barcode.findOne({
        include: [{model: Games}],
        where: {barocode: code}
    }).then(barcode => {
        res.render("admin/barcodes/search", {barcode: barcode})
    })
});

router.post("/barcode/create", adminAuth, (req, res) => {
    var barcode     = req.body.barcode;
    var gameId      = req.body.gameId;

    Barcode.create({barcode: barcode, gameId: gameId}).then(() => {
        res.redirect("/admin/barcode");
    }).catch(() => {
        res.render("error", {message: "Algo deu errado!", link: "/admin/barcode", user: true});
    });
});

module.exports = router;