/**
 * Created with JetBrains WebStorm.
 * User: zzn
 * Date: 6/9/13
 * Time: 11:59 AM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var SiyuanUserProfile =
  require('../models/siyuanuserprofile');
var logger = require('log4js').getDefaultLogger();

/**
 * Create a siyuan object
 *
 * @param {object} req Request for a query.
 * @param {object} res Response for a query.
 */
exports.post = function(req, res) {
  logger.info('post!');
  SiyuanUserProfile.create(req.query.newDoc,
    function(err, doc) {
      logger.info('posted!');
      if (err) {
        logger.debug('err!');
      }
      res.send(doc);
    });
};

/**
 *
 * @param {object} req Request for a query.
 * @param {object} res Response for a query.
 */
exports.get = function(req, res) {
  var theid = req.params.theid;
  SiyuanUserProfile.findById(theid, function(err, doc) {
    res.send(doc);
  });
};

/**
 * Update a siyuan object
 * @param {object} req Request for a query.
 * @param {object} res Response for a query.
 */
exports.put = function(req, res) {
  logger.info('put: ' + JSON.stringify(req.query));
  var theid = req.params.theid;
  SiyuanUserProfile.findByIdAndUpdate(theid, { $set: req.query},
    function(err, doc) {
      logger.info('found and updated!' + JSON.stringify(doc));
      if (err) {
        logger.debug('err!');
      }
      res.send('ok');
  });
};

/**
 *
 * @param {object} req Request for a query.
 * @param {object} res Response for a query.
 */
exports.delete = function(req, res) {
  var theid = req.params.theid;
  logger.info('try to deleted!, id = ' + theid);
  SiyuanUserProfile.findByIdAndRemove(theid, function() {
    logger.info('deleted!, id = ' + theid);
    res.send('ok');
  });
};
