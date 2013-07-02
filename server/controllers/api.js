'use strict';

var mongoose = require('mongoose');
var SiyuanUserProfile = require('../models/SiyuanUserProfile');
var User = require('../models/User');
var logger = require(process.env.ROOT_DIR + '/server/services/loggerservice').default;
var Q = require('q');

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
    req.query.criteria = req.query.criteria  || '{}';
    var criteria = JSON.parse(req.query.criteria);

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
    if(req.query.criteria === undefined) {
      req.query.criteria = '{}';
    }
    var fields = '_id 姓名'; // public query only serves as public.
    var criteria = JSON.parse(req.query.criteria);

    Q.fcall(function() {
      var d = Q.defer();
      SiyuanUserProfile.find(criteria, fields, function(err, siyuanUserProfiles) {
        if(err)d.reject(new Error(err));
        else {
          var map = {};
          for(var i in siyuanUserProfiles) {
            var s = siyuanUserProfiles[i];
            map[s._id] = s;
          }
          d.resolve({'siyuanUserProfile': map});
        }
      });
    })
    .then(function(docs){
      var d = Q.defer();
      User.find({'siyuanid':  {"$exists" : true, "$ne" : ""} },'_id siyuanid auth', function(err, users){
        if (err)d.reject(new Error(err));
        else{
          docs['users'] = users;
          d.resolve(docs);
        }
      });
    }).then(function(docs){
      for(var i in docs.users) {
        var user = docs.users[i];
        for(var authMethod in user.auth){
          docs.siyuanUserProfiles[user.siyuanid] = docs.siyuanUserProfiles[user.siyuanid]|| [];
          docs.siyuanUserProfiles[user.siyuanid].push({
            'provider': user.auth.provider,
            'url': '#' // TODO(zzn): add url here;
          });
        }
      }
      var arraySiyuanUserProfiles = [];
      for (i in docs.siyuanUserProfiles) {
        arraySiyuanUserProfiles.push(docs.siyuanUserProfiles[i]);
      }

      res.send(arraySiyuanUserProfiles);
      }, function(err){
        logger.error(err);
      });

  }
  else {
    res.send('failed, collection not specified or collection ' + collection +
      ' is not supported for query');
    // TODO(zzn): handle error
    // TODO(zzn): support more type of collections
  }
};