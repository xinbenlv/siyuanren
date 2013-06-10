var log4js = require('log4js');
var logger = log4js.getLogger();
var log = console.log;
var $ = require('jquery');

var SiyuanUserProfile = require('../models/siyuanuserprofile');

/**
 *
 * @param {object} req Request for a query.
 * @param {object} res Response for a query.
 */
exports.query = function(req, res) {
  var collection = req.query.collection;
  if (collection == 'SiyuanUserProfile') {
    logger.info('Query criteria: ' + req.query.criteria);
    var criteria = $.parseJSON(req.query.criteria);

    SiyuanUserProfile.find(criteria, function(err, docs) {
      logger.info('Query criteria: ' + JSON.stringify(criteria));
      res.send(docs);
    });
  }
  else {
    res.send('failed, collection not specified or collection ' + collection +
      ' is not supported for query');
    // TODO(zzn): handle error
    // TODO(zzn): support more type of collections
  }
};

/**
 * Exporting siyuan API
 */
exports.siyuan = require('./siyuan');



