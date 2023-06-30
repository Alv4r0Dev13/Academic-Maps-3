const sessionUser = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};

const userRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'login');
    req.session.save(() => res.redirect('/'));
    return;
  }
  next();
};

const adminRequired = (req, res, next) => {
  if (!req.session.user || req.session.user.type !== 'admin') {
    req.flash('errors', 'admin');
    req.session.save(() => res.redirect('/'));
    return;
  }
  next();
}

module.exports = {
  sessionUser,
  userRequired,
  adminRequired
};