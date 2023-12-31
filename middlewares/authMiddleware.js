const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/profile');
    } else {
        next();
    }
};

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = { redirectHome, redirectLogin };
