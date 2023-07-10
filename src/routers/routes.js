const path = require('path');
const express = require('express');
const router = express.Router();

const home = require(path.resolve(__dirname, '..', 'controllers', 'homeController'));
const map = require(path.resolve(__dirname, '..', 'controllers', 'mapController'));
const user = require(path.resolve(__dirname, '..', 'controllers', 'userController'));

const session = require(path.resolve(__dirname, '..', 'middlewares', 'sessionMiddleware'));

router.get('/', home.index);
router.post('/create', session.adminRequired, home.createEvent);
router.post('/edit', session.adminRequired, home.updateEvent);

// User routers
router.get('/login', user.loginIndex);
router.get('/signin', user.signinIndex);
router.get('/user', (req, res) => res.send(req.session.user));

router.get('/logout', session.userRequired, user.logout);
router.post('/signin', user.signin);
router.post('/login', user.login);
router.post('/subscribeEvent', session.userRequired, user.subscribeEvent);


// Maps routers
router.get('/events', map.readAll);
router.get('/event/:id', map.readById);
router.post('/event/create', session.adminRequired, map.createEvent);
router.post('/event/update/:id', session.adminRequired, map.updateEvent);
router.post('/event/delete', session.adminRequired, map.deleteEvent);

router.post('/search', (req, res) => {
  let text = req.body.text;

  if (text === '') {
    res.redirect('/');
  } else {
    res.redirect('/search/' + text);
  }
});

router.get('/search/:text', map.searchByText);

module.exports = router;