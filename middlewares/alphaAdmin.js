function adminAuth(req, res, next){
    if (req.session.user != undefined){
        if (req.session.user["email"] == "alpha.admin@nandogames.com") {
            next();
        } else {
            res.render("error", {message: "Você não tem permissão para executar esta tarefa! Por favor consulte o alpha admin da página"})
        }
    } else {
        res.redirect("/login");
    }
}

module.exports = adminAuth;