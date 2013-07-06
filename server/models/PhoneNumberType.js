'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator').validate;

var phoneNumberValidators = [validate('isEmail')];

var PhoneNumberType = new Schema({
  countryCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  extension: String,
  notes: String
});

/**
 *
 * @type {User} a model of emails
 */
module.exports = PhoneNumberType;
