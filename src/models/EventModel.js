const mongoose = require('mongoose');
const neo4j = require('../db/neo4j');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  positionLat: { type: String, required: true },
  positionLng: { type: String, required: true },
  description: { type: String, default: '' },
  startDate: { type: Date, default: new Date().getTime },
  endingDate: { type: Date, default: new Date().getTime }
});

EventSchema.index({ title: 'text', description: 'text' },
  { default_language: 'pt', weights: { title: 2, description: 1 } });

const EventModel = mongoose.model('Event', EventSchema);

class Event {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.event = null;
  }

  async create() {
    this.event = await EventModel.create(this.body);
    // Cria no Neo4J
    let eventId = this.event._id.toString('hex');
    await neo4j.run('CREATE (:Event{id:$eventId})', { eventId })
      .then(result => console.log(result.summary.counters._stats.nodesCreated))
      .catch(e => console.log(e));
  }

  static async readAll() {
    const events = await EventModel.find();
    return events;
  }

  static async readById(id) {
    if (typeof id !== 'string') return typeof id;
    const event = await EventModel.findById(id);
    return event;
  }

  async update(id) {
    if (typeof id !== 'string') return;
    this.event = await EventModel.findByIdAndUpdate(id, this.body, { new: true });
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    const event = await EventModel.findByIdAndDelete(id);
    return event;
  }

  static async search(text) {
    const events = await EventModel.find({ $text: { $search: text } });
    return events;
  }
}

module.exports = Event;