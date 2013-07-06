'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OauthType = new Schema({
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true }
});

/**
 *
 * @type {User} a model of emails
 */
module.exports = OauthType;
