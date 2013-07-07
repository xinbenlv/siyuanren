'use strict';

var mongoose = require('mongoose');
var SiyuanUserProfile = require('../models/SiyuanUserProfile');
var User = require('../models/User');
var logger = require(process.env.ROOT_DIR + '/server/services/loggerservice').default;
var Q = require('q');


var parseQueryOptions = function(query) {
  logger.info('Query: ' + JSON.stringify(query));
  var collection = JSON.parse(query.collection);
  logger.debug('collection: ' + collection);
  var ret = {};

  if (!collection) {
    ret['error'] = new Error('Empty collection: query = ' + query);
    return ret;
  } else if(['SiyuanUserProfile'].indexOf(collection) == -1) {
    ret['error'] = new Error('Incorrect collection:' + query.collection);
    return ret;
  } else {
    ret['collection'] = collection;
  }

  if (!query.criteria) {
    ret['criteria'] = {};
  } else {
    try {
      ret['criteria'] = JSON.parse(query.criteria);
    } catch(err) {
      ret['error'] = err;
      return ret;
    }
  }

  if (!query.fields) {
    ret['error'] = new Error('Empty fields: query = ' + query);
    return ret;
  } else {
    try {
      ret['fields'] = JSON.parse(query.fields);
    } catch(err) {
      ret['error'] = err;
      return ret;
    }
  }
  return ret;
}

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
  var options = parseQueryOptions(req.query);
  logger.info('options:' + JSON.stringify(options));
  if(options.error) {
    res.send(400, options.error);
  } else {
    Q.fcall(function () {
      var d = Q.defer();
      SiyuanUserProfile.find(options.criteria, options.fields, function (err, siyuanUserProfiles) {
        if (err)d.reject(new Error(err));
        else {
          var map = {};
          for (var i in siyuanUserProfiles) {
            var s = siyuanUserProfiles[i];
            map[s._id] = s;
          }
          d.resolve({'siyuanUserProfiles': map});
        }
      });
      return d.promise;
    })
      .then(function (docs) {
        var d = Q.defer();

        User.find({siyuanid: { $exists: true }}, function (err, users) {
          if (err)d.reject(new Error(err));
          else {
            docs['users'] = users;
            d.resolve(docs);
          }
        });
        return d.promise;
      }).then(function (docs) {
        for (var i in docs.users) {
          var user = docs.users[i];
          var auth = user.auth;
          for (var i = 0; i < auth.length; i++) {
            var authMethod = auth[i];
            if (!docs.siyuanUserProfiles[user.siyuanid]._doc.auth) {
              docs.siyuanUserProfiles[user.siyuanid]._doc.auth = [];
            }

            docs.siyuanUserProfiles[user.siyuanid]._doc.auth.push({
              'provider': authMethod.provider,
              'url': '#' // TODO(zzn): add url here;
            });
          }
        }

        var arraySiyuanUserProfiles = [];
        for (i in docs.siyuanUserProfiles) {
          arraySiyuanUserProfiles.push(docs.siyuanUserProfiles[i]._doc);
        }

        res.send(arraySiyuanUserProfiles);
      }).then(function () {
      },function (err) {
        logger.error(err);
      }).done();
  }

};

exports.publicquery = function(req, res) {
  logger.info('Public Query: ' + JSON.stringify(req.query));
  var options = parseQueryOptions(req.query);
  logger.info(options);

  if(!options.error && options.fields == '姓名 思源学员期数') {
    logger.info('Query options: ' + options);

    SiyuanUserProfile.find(options.criteria, options.fields, function(err, docs) {
      res.send(docs);
    });
  } else if(options.fields !== ['姓名', '思源学员期数']) {
    res.send(400, 'Sorry, the fields you provided are illegal for public query.');
  } else {
    res.send(400, options.error);
  }
};
