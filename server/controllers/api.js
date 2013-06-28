'use strict';

var mongoose = require('mongoose');
var SiyuanUserProfile =
  require('../models/SiyuanUserProfile');
var logger = require('log4js').getDefaultLogger();
var $ = require('jquery');

exports.post = function(req, res) {
  SiyuanUserProfile.create(req.query.newDoc,
    function(err, doc) {
      if (err) {
        logger.debug('err!');
      }
      res.send(doc);
    });
};

exports.get = function(req, res) {
  var theid = req.params.theid;
  SiyuanUserProfile.findById(theid, function(err, doc) {
    res.send(doc);
  });
};

exports.put = function(req, res) {
  var theid = req.params.theid;
  SiyuanUserProfile.findByIdAndUpdate(theid, { $set: req.query},
    function(err, doc) {
      if (err) {
        logger.debug('err!');
      }
      res.send('ok');
  });
};

exports.delete = function(req, res) {
  var theid = req.params.theid;
  SiyuanUserProfile.findByIdAndRemove(theid, function() {
    res.send('ok');
  });
};

exports.index = function(req, res) {
  res.json(200,'API is working.');
};

exports.query = function(req, res) {
  var collection = req.query.collection;

  if (collection == 'SiyuanUserProfile') {
    logger.info('Query criteria: ' + req.query.criteria);
    var criteria = $.parseJSON(req.query.criteria);
    var fields = req.query.fields;
    SiyuanUserProfile.find(criteria, fields, function(err, docs) {
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

exports.publicquery = function(req, res) {
  var collection = req.query.collection;

  if (collection == 'SiyuanUserProfile') {
    logger.info('Query criteria: ' + req.query.criteria);
    var fields = '_id 姓名'; // public query only serves as public.
    var criteria = $.parseJSON(req.query.criteria);
    SiyuanUserProfile.find(criteria, fields, function(err, docs) {
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