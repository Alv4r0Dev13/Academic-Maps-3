const Event = require('../models/EventModel');

const index = async (req, res) => {
  try {
    let events = await Event.readAll();
    res.render('index', { events });
  } catch (e) {
    console.error(e);
    res.status(404).send('err/404');
  };
};

const createEvent = (req, res) => {
  const pos = req.body;
  res.render('event', {
    method: 'create',
    event: {
      _id: false,
      positionLat: pos.lat,
      positionLng: pos.lng
    }
  });
};

const updateEvent = (req, res) => {
  res.render('event', { method: 'update', event: req.body });
};

module.exports = {
  index,
  createEvent,
  updateEvent
};