const env = process.env;

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

function getMongoose() {
  if (!connected) connect();
  return mongoose;
}

module.exports = {
  dbConn,
  connect,
  getMongoose,
};