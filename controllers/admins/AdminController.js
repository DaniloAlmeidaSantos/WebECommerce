const express   = require("express");
const router    = express.Router();
const Admin     = require("../../Models/Admin");
const bcrypt    = require("bcryptjs");
const adminAuth = require("../../middlewares/adminAuth");
const alphaAuth = require("../../middlewares/alphaAdmin");

// Routers 
router.get("/admin/users", adminAuth, (req, res) => {
    Admin.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

// Creating new Admins / Users
router.post("/admin/create", (req, res) => {
    var name        = req.body.name;
    var lastName    = req.body.lastName;
    var email       = req.body.email;
    var password    = req.body.password;

    Admin.findOne({where: {email: email}}).then(admin => {
        if (admin == undefined) {
            var salt    = bcrypt.genSaltSync(10);
            var hash    = bcrypt.hashSync(password, salt);

            Admin.create({
                name: name,
                lastName: lastName,
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/login");
            }).catch(() => {
                res.redirect("/admin/users/create");
            });
        } else {
            res.redirect("/admin/users/create");
        }
    });
});

router.post("/admin/delete", alphaAuth, (req, res) => {
    var id = req.body.id;

    if (id != undefined) {

        if (!isNaN(id)) {
            Admin.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users");
            });
        } else {
            res.redirect("/admin/users");
        }

    } else {
        res.redirect("/admi/users");
    }
});

router.get("/admin/user/edit/:id", alphaAuth, (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/users");
    }

    Admin.findByPk(id).then(admin => {
        if (admin != undefined) {
            res.render("admin/users/edit", {admin: admin});
        } else {
            res.redirect("/admin/users");
        }
    }).catch(error => {
        res.redirect("/admin/users");
    });
});

router.post("/admin/update", alphaAuth, (req, res) => {
    var id          = req.body.id;
    var name        = req.body.name;
    var lastName    = req.body.lastName;
    var email       = req.body.email;

    Admin.update(
        {
            name: name, 
            lastName: lastName,
            email: email,
            password: password
        }, 
        {
            where: {
                id: id
            }
        }
    ).then(() => {
        res.redirect("/admin/users");
    });
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    var email       = req.body.email;
    var password    = req.body.password;

    Admin.findOne({where: {email: email}}).then(admin => {
        if (admin != undefined) {
            var correct = bcrypt.compareSync(password, admin.password);

            if (correct) {
                req.session.user =  {
                    id: admin.id,
                    email: admin.email
                }
                res.redirect("/admin/users");
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    });
});

router.get("/logout", adminAuth, (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

// Admin.sync({force: true});

module.exports = router;