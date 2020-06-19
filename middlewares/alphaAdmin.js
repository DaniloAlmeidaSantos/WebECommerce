function adminAuth(req, res, next){
    if (req.session.user != undefined){
        if (req.session.user["email"] == "alpha.admin@nandogames.com") {
            next();
        } else {
            res.render("error", {message: "Você não tem permissão para executar esta tarefa! <br> Por favor consulte o alpha admin da página", user: true})
        }
    } else {
        res.redirect("/login");
    }
}

module.exports = adminAuth;