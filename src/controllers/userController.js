const User = require('../models/UserModel');

const loginIndex = (req, res) => {
  res.render('login');
};

const login = async (req, res) => {
  try {
    let u = new User(req.body);
    await u.login();

    if (u.errors.length > 0) {
      req.flash('errors', u.errors);
      req.session.save(() => res.redirect('/login'));
      return;
    }

    req.session.user = u.user;
    req.session.save(() => res.redirect('/'));
    return;
  } catch (e) {
    console.error(e);
  }
};

const signinIndex = (req, res) => {
  res.render('signin');
};

const signin = async (req, res) => {
  try {
    let u = new User(req.body);
    await u.register();

    if (u.errors.length > 0) {
      req.flash('errors', u.errors);
      req.session.save(() => res.redirect('/signin'));
      return;
    }

    req.session.user = u.user;
    req.session.save(() => res.redirect('/'));
    return;
  } catch (e) {
    console.error(e);
  }
};

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const subscribeEvent = async (req, res) => {
  try {
    let userId = req.body.user;
    let eventId = req.body.event;
    await User.subscribe(userId, eventId);
  } catch (e) {
    console.log(e);
  }
  res.redirect('/');
};

module.exports = {
  loginIndex,
  login,
  signinIndex,
  signin,
  logout,
  subscribeEvent
};