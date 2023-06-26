require('dotenv').config();
module.exports = (req, res, next) => {
  res.locals.apiKey = process.env.API_KEY;
  next();
};