exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You are not logged in');
        res.redirect("/users/login");
    } else {
        next();
    }
}

exports.isLoggedOut = (req, res, next) => {
    if (req.session.user) {
        req.flash('error', 'You are already logged in');
        res.redirect("/users/profile");
    } else {
        next();
    }
}

exports.isUser = (req, res, next) => {
    if(req.session.user) {
        res.redirect("/users");
    }
    else{
        res.redirect("/users/login");
    }
}

