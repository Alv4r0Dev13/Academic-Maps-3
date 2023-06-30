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

router.get('/mapsdb-api/v1/singout', session.userRequired, user.logout);
router.post('/mapsdb-api/v1/singin', user.signin);
router.post('/mapsdb-api/v1/login', user.login);
router.post('/mapsdb-api/v1/subscribeEvent', session.userRequired, user.subscribeEvent);


// Maps routers
router.get('/mapsdb-api/v1/readAll', map.readAll);
router.get('/mapsdb-api/v1/readById/:id', map.readById);
router.post('/mapsdb-api/v1/create', session.adminRequired, map.createEvent);
router.post('/mapsdb-api/v1/update/:id', session.adminRequired, map.updateEvent);
router.post('/mapsdb-api/v1/delete/', session.adminRequired, map.deleteEvent);

router.post('/mapsdb-api/v1/search', (req, res) => {
  let text = req.body.text;

  if (text === '') {
    res.redirect('/');
  } else {
    res.redirect('/mapsdb-api/v1/search/' + text);
  }
});

router.get('/mapsdb-api/v1/search/:text', map.searchByText);

module.exports = router;