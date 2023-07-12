const path = require('path');
// const Event = require(path.resolve(__dirname, '..', 'models', 'EventModel'));
const Event = require('../models/EventModel');

const readAll = async (req, res) => {
  let events = await Event.readAll();
  res.send(events);
};

const readById = async (req, res) => {
  let id = req.params.id;
  const event = await Event.readById(id);
  res.send(event);
};

const createEvent = async (req, res) => {
  const e = new Event(req.body);
  await e.create();
  res.redirect('/');
};

const updateEvent = async (req, res) => {
  let id = req.params.id;
  const e = new Event(req.body);
  await e.update(id);
  res.redirect('/');
};

const deleteEvent = async (req, res) => {
  let id = req.body.id;
  await Event.delete(id);
  res.redirect('/');
};

module.exports = {
  readAll,
  readById,
  createEvent,
  updateEvent,
  deleteEvent,
};