const mongoose = require('mongoose');
const neo4j = require('../db/neo4j');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, default: 'regular' }
});

const UserModel = new mongoose.model('User', UserSchema);

class User {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.validate();
    if (this.errors.length > 0) return;

    this.user = await UserModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.errors.push('Usuário não existe!');
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida!');
      this.user = null;
      return;
    }
  }

  async register() {
    this.validate();
    if (this.errors.length > 0) return;

    await this.usernameExists();
    if (this.errors.length > 0) return;

    await this.userExists();
    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await UserModel.create(this.body);

    // Cria no Neo4J
    let userId = this.user._id.toString('hex');
    await neo4j.run('CREATE (:User{id:$userId})', { userId })
      .then(result => console.log(result.summary.counters._stats.nodesCreated))
      .catch(e => console.log(e));
  }

  validate() {
    this.cleanUp();

    // The email must be valid
    if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido!');
    // The password must have between 8 and 20 characters
    if (this.body.password.length < 8 || this.body.password.length > 20)
      this.errors.push('A senha deve ter entre 8 e 20 caracteres!');
  }

  cleanUp() {
    for (const key in this.body)
      if (typeof this.body[key] !== 'string') this.body[key] = '';

    this.body = {
      name: this.body.name,
      email: this.body.email,
      password: this.body.password
    };
  }

  async usernameExists() {
    const username = await UserModel.findOne({ name: this.body.name });
    if (username) this.errors.push('Nome de usuário indisponível');
  }

  async userExists() {
    const user = await UserModel.findOne({ email: this.body.email });
    if (user) this.errors.push('Email já cadastrado!');
  }

  static async subscribe(userId, eventId) {
    await neo4j.run('MATCH (u:User{id:$userId}) OPTIONAL MATCH (e:Event{id:$eventId}) CREATE (u)-[:SUBSCRIBED]->(e)', {
      userId,
      eventId
    }).then(result => console.log(result.summary.counters._stats.relationshipsCreated))
      .catch(e => console.error(e));
  }

  static async readSubscribed(user, session) {
    let response;
    if (!session) {
      await neo4j.run('MATCH (u:User)-[:SUBSCRIBED]->(e:Event) WHERE u.id = $user RETURN e.id as events', { user })
        .then(result => response = result.records);
    } else {
      await session.run('MATCH (u:User)-[:SUBSCRIBED]->(e:Event) WHERE u.id = $user RETURN e.id as events', { user })
        .then(result => response = result.records);
    }
    return response;
  }

  static async readRecommended(user) {
    let response;
    await neo4j.run(
      'MATCH (u:User)-[:SUBSCRIBED]->(e:Event)<-[:SUBSCRIBED]-(u2:User) WHERE u.id = $user RETURN DISTINCT u2.id as userId', { user })
      .then(result => response = result.records);
    const recommendedUsers = response.map(record => record.get('userId'));

    let events = new Set();
    for (let userId of recommendedUsers) {
      let userEvents = await this.readSubscribed(userId, neo4j);
      userEvents.forEach(event => events.add(event._fields[0]));
    }
    let uniqueEvents = [...events];

    let subscribedEvts = [];
    let responseSub = await this.readSubscribed(user, neo4j);
    for (let record of responseSub) subscribedEvts.push(record._fields[0]);

    let recommendedEvts = uniqueEvents.filter(evt => !subscribedEvts.includes(evt));
    return recommendedEvts;
  }
}

module.exports = User;