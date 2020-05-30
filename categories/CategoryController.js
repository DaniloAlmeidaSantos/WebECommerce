const express       = require("express");
const router        = express.Router();
const Category      = require("./Category");
const slugify       = require("slugify");
const adminAuth     = require("../middlewares/adminAuth");

router.get("/admin/categories", adminAuth, (req, res) => {
    res.render("admin/games/index");
});

router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll().then(categories =>  {
        res.render("admin/categories/index", {categories: categories})
    })
});

router.get("/admin/category/new", adminAuth, (req, res) => {
    res.render("admin/categories/new")
});

router.get("/admin/category/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;

    Category.findByPk(id).then(category => {
        res.rende("admin/categories/edit", {category: Category})
    })
});

router.post("/category/create", adminAuth, (req, res) => {
    var title = req.body.title;

    if (title != undefined) {
        Category.findOne({where: {title: title}}).then(category => {
            if (category == undefined) {
                Category.create({
                    title: title,
                    slug: slugify(title)
                }).then(() => {
                    res.redirect("/admin/categories")
                }).catch(err => {
                    res.redirect("/admin/category/new", {err: err})
                }); 
            } else {
                res.redirect("/admin/categories");
            }
        })
    } else {
        res.redirect("/admin/categories")
    }
});

router.post("/category/update", adminAuth, (req, res) => {
    var id      = req.body.id;
    var title   = req.body.title;

    if (id != undefined && title != undefined) {
        Category.update(
            {
                title: title,
                slug: slugify(title)
            },
            {
                where: {
                    id: id
                }
            }
        ).then(() => {
            res.redirect("/admin/categories")
        })
    } else {
        res.redirect("/admin/categories");
    }
});



module.exports = router;