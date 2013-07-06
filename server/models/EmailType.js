'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator').validate;

var emailValidators = [validate('isEmail')];

var EmailType = new Schema({
  address: { type: String, required: true, unique: true, validate: emailValidators },
  notes: String
});

/**
 *
 * @type {User} a model of emails
 */
module.exports = EmailType;
