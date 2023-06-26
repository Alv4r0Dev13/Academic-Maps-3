require('dotenv').config();
const env = process.env;
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// EXPRESS
const router = require(path.resolve(__dirname, 'routers', 'routes'));

const mongo = require(path.resolve(__dirname, 'db', 'mongo'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(cookieParser());

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

const mapsApiMiddleware = require(path.resolve(__dirname, 'middlewares', 'mapsApiMiddleware'));
app.use(mapsApiMiddleware);

app.use(router);

mongo.connect().then(() => {
  app.listen(port, () => console.log(`Server listening on port ${port}\nAcess: http://localhost:${port}`));
});