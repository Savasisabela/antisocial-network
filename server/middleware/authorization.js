module.exports.requireNotLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect("/profile");
    }
    next();
};
module.exports.requireLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/welcome");
    }
    next();
};
