const mongoose = require('mongoose');
const driver = require('../db/neo4j');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
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
}

module.exports = User;