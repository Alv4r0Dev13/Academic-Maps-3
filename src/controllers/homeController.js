const Event = require('../models/EventModel');
const User = require('../models/UserModel');

const index = async (req, res) => {
  let events = await showEvents(res, req.session.user, false);
  res.render('index', events);
};

const searchByText = async (req, res) => {
  let events = await showEvents(res, req.session.user, req.params.text);
  res.render('index', events);
};

const showEvents = async (res, user, text) => {
  try {
    let eventsSub = false, eventsRec = false;
    if (user && user.type !== 'admin') {
      eventsSub = [];
      let response = await User.readSubscribed(user._id);
      if (response && response.length > 0) {
        for (let record of response) {
          let evtData = await Event.readById(record._fields[0]);
          eventsSub.push(evtData);
        }

        eventsRec = [];
        let recResponse = await User.readRecommended(user._id);
        for (let evtId of recResponse) {
          let evtData = await Event.readById(evtId);
          eventsRec.push(evtData);
        }
      }
    }
    let events;
    if (text) events = await Event.search(text);
    else events = await Event.readAll();

    return { events, eventsSub, eventsRec };
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
  searchByText,
  showEvents,
  createEvent,
  updateEvent
};