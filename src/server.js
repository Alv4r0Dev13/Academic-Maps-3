require('dotenv').config();
const env = process.env;
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// EXPRESS
const router = require(path.resolve(__dirname, 'routers', 'routes'));

const mong = require(path.resolve(__dirname, 'db', 'database'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(cookieParser());

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(router);

mong.connect().then(() => {
  app.listen(port, () => console.log(`Server listening on port ${port}\nAcess: http://localhost:${port}`));
});