const express       = require("express");
const router        = express.Router();
const Barcode       = require("../../Models/Barcodes");
const Games         = require("../../Models/Games");
const adminAuth     = require("../../middlewares/adminAuth");

router.get("/admin/barcode/search/:barcode", adminAuth, (req, res) => {
    var code = req.params.barcode;

    Barcode.findOne({
        include: [{model: Games}],
        where: {barocode: code}
    }).then(barcode => {
        res.render("admin/barcodes/search", {barcode: barcode})
    })
});

module.exports = router;