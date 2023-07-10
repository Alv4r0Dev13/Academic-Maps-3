const Event = require('../models/EventModel');
const User = require('../models/UserModel');

const index = async (req, res) => {
  try {
    let eventsSub = false;
    if (req.session.user && req.session.user.type !== 'admin') {
      eventsSub = [];
      let response = await User.readSubscribed(req.session.user._id);
      if (response && response.length > 0) for (record of response) {
        let evtData = await Event.readById(record._fields[0]);
        eventsSub.push(evtData);
      }
    }
    let events = await Event.readAll();
    res.render('index', { events, eventsSub });
  } catch (e) {
    console.error(e);
    res.status(404).render('err/404');
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