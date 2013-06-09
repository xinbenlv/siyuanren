/**
 * Created with JetBrains WebStorm.
 * User: zzn
 * Date: 6/9/13
 * Time: 11:59 AM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var schema = require('./schema');
var SiyuanUserProfile = schema.SiyuanUserProfile;
var logger = require('log4js').getDefaultLogger();

/**
 * Create a siyuan object
 * @param req
 * @param res
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
 * @param req
 * @param res
 */
exports.get = function(req, res) {
  var theid = req.params.theid;
  SiyuanUserProfile.findById(theid, function(err, doc) {
    res.send(doc);
  });
};

/**
 * Update a siyuan object
 * @param req
 * @param res
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
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
  var theid = req.params.theid;
  logger.info('try to deleted!, id = ' + theid);
  SiyuanUserProfile.findByIdAndRemove(theid, function() {
    logger.info('deleted!, id = ' + theid);
    res.send('ok');
  });
};
