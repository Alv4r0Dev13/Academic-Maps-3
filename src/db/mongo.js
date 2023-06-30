const env = process.env;
const path = require('path');

// DATABASE
const mongoose = require('mongoose');

const dbConn = 'Database connected';
var connected = false;

async function connect() {
  connected = true;
  return new Promise(async (resolve) => {
    await mongoose.connect(env.ATLASDB_CONN, { writeConcern: { wtimeout: 30000 } }).catch(err => {
      console.error(err);
      process.exit(5);
    });
    resolve(mongoose);
  });
}
// Session
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionOptions = session({
  secret: 'mickey mouse',
  store: new MongoStore({ mongoUrl: env.ATLASDB_CONN }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

function getMongoose() {
  if (!connected) connect();
  return mongoose;
}

module.exports = {
  dbConn,
  connect,
  getMongoose,
  sessionOptions
};