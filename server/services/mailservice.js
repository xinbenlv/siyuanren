'use strict';

var logger = require(process.env.ROOT_DIR + '/server/services/loggerservice').default;

var emailjs = require('emailjs');
var MailService = emailjs.server.connect({
  user: process.env.MANDRILL_USERNAME,
  password: process.env.MANDRILL_APIKEY,
  host: 'smtp.mandrillapp.com',
  ssl: true
}, function(err, message) { console.log(err || message); });

var printMandrillInfo = function () {
  var Mandrill = require('mandrill-api').Mandrill;
  var m = new Mandrill();
  m.users.info(function (info) {
    logger.info('Mandrill Information:');
    logger.info('  Reputation: ' + info.reputation);
    logger.info('  Hourly Quota: ' + info.hourly_quota);
  });
}

var sendDevInstanceStartEmail = function () {
  MailService.send({
    text: 'local instance started!',
    from: 'admin@siyuanren.org',
    to: 'xinbenlv@gmail.com',
    subject: 'local instance started!'}, function (err, msg) {
    logger.warn(err);
    logger.debug(msg);
  });
};

/**
 *
 * @type {{EmailService: *}}
 */
module.exports = {
  MailService: MailService,
  printMandrillInfo: printMandrillInfo,
  sendDevInstanceStartEmail: sendDevInstanceStartEmail
};

sendDevInstanceStartEmail();