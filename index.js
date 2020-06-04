// Packages
const express       = require("express");
const app           = express();
const bodyParser    = require("body-parser");
const connection    = require("./database/database");
const session       = require("express-session");

// Controllers
const adminController      = require("./admins/AdminController");
const gameController       = require("./games/GameContoller");
const categoryController   = require("./categories/CategoryController");

// Models
const Admin     = require("./admins/Admin");
const Game      = require("./games/Games");
const Category  = require("./categories/Category");

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

app.get("/", (req, res) => {
    Game.findAll().then(games => {
        if (req.session.user) {
            res.render("index", {user: true, games: games});
        } else {
            res.render("index", {user: false, games: games});
        }
    })
});

app.get("/purchase/:id", (req, res) => {
    var id = req.params.id;

    Game.findOne(
        {
            include:  [{model: Category}],
            where: {id: id}
        }
    ).then(game =>  {
        if (req.session.user) {
            res.render("purchase", {user: true, game: game});
        } else {
            res.render("purchase", {user: false, game: game});
        }
    })
});

app.listen(8080, () => {
    console.log("Server is running");
});
