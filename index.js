// Packages
const express       = require("express");
const app           = express();
const bodyParser    = require("body-parser");
const connection    = require("./Models/database/database");
const session       = require("express-session");

// Controllers
const barcodeController    = require("./controllers/barcodes/barcodeController");
const saleController       = require("./controllers/sales/saleController");
const adminController      = require("./controllers/admins/AdminController");
const gameController       = require("./controllers/games/GameContoller");
const categoryController   = require("./controllers/categories/CategoryController");

// Models
const Admin     = require("./Models/Admin");
const Barcode   = require("./Models/Barcodes");
const Sale      = require("./Models/Sales");
const Game      = require("./Models/Games");
const Category  = require("./Models/Category");

// View Engine
app.set('view engine', 'ejs');

// Config Sessions
app.use(session({
    secret: "DBjhBnmnDB nasadbJHGFDHGSVAd @YTEY#@&Yhb3e7436 BDAHGDYSm DBHSDASD",
    cookie: {
        maxAge: 3000000000
    }
}));

// Static
app.use(express.static('public'));

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Connecting in database
connection
    .authenticate()
    .then(() => {
        console.log("Connection is success!");
    }).catch((error) => {
        console.log(error);
    });

// Routers
app.use("/", adminController);
app.use("/", categoryController);
app.use("/", gameController);
app.use("/", barcodeController);
app.use("/", saleController);

app.get("/", (req, res) => {
    Game.findAll({limit: 6, order: [['id', 'DESC']]}).then(games => {
        if (req.session.user) {
            res.render("index", {user: true, games: games});
        } else {
            res.render("index", {user: false, games: games});
        }
    })
});

// Page for purchase game
app.get("/purchase/:id", (req, res) => {
    var id = req.params.id;
    if (!isNaN(id)) {
        Game.findOne(
            {
                include:  [{model: Category}],
                where: {id: id}
            }
        ).then(game =>  {
            if (req.session.user) {
                res.render("utils/purchase", {user: true, game: game});
            } else {
                res.render("utils/purchase", {user: false, game: game});
            }
        })
    } else {
        
    }
    
});

// Pagination games in sale
app.get("/games/page/sale/:num", (req, res) => {
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
            if (req.session.user) {
                res.render("utils/pageSaleGames", {user: true, result: result});
            } else {
                res.render("utils/pageSaleGames", {user: false, result: result});
            }
        }
    })
});

app.listen(80, () => {
    console.log("Server is running");
});
