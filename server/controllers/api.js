'use strict';

var mongoose = require('mongoose');
var SiyuanUserProfile = require('../models/SiyuanUserProfile');
var User = require('../models/User');
var ChangeHistory = require('../models/ChangeHistory');

var logger = require(process.env.ROOT_DIR + '/server/services/loggerservice').default;
var Q = require('q');
var MailService = require('../services/mailservice').MailService;

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
  logger.debug('Save to id' + theid);
  logger.debug('Query: ' + req.query);
  logger.debug('User: ' + JSON.stringify(req.user));
  User.findOne({username: req.user.username}, function(err, user){
    var changeHistory = new ChangeHistory({
      timestamp: new Date(),
      user: user._id,
      siyuanUserProfile: theid,
      fieldSet: req.query
    });
    changeHistory.save();
  });


  SiyuanUserProfile.findByIdAndUpdate(theid, { $set: req.query},
    function(err, doc) {
      if (err) {
        logger.error('err!' + JSON.stringify(err));
        res.send(500,'There is something wrong in the server');
      } else{
        res.send(200, 'ok');
      }
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
      var query = SiyuanUserProfile.find(options.criteria);
      for(var i in options.fields) {
        query.populate(options.fields[i])
      }
      query.exec(function (err, siyuanUserProfiles) {
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

exports.onboard = {
  post: function(req, res) {
    logger.debug('post query: ' + JSON.stringify(req.query));
    logger.debug('post body: ' + JSON.stringify(req.body));


    var token = req.body.token;
    User.findOne({registerToken: token}, function(err, user){
      if(err || !user) {
        res.send(403, err);
      } else {
        user.setPassword(req.body.password, function(err, user){
          if(err || !user) return res.send(403, err);
          user.username = req.body.username;
          user.registerToken = require("randomstring").generate(32); // Reset a new random registerToken to invalidate old one.
          user.save();
          res.send(200, 'ok');
        });

      }
    });
  },
  get: function(req, res) {
    var token = req.query.token;
    logger.debug('Token:' + token);
    User.findOne({registerToken: token}, function(err, user){
      logger.debug('User:' + JSON.stringify(user));
      logger.debug('Err:' + JSON.stringify(err));
      if(err || !user) {
        res.send(403, err);
      } else {
        return res.send(200, user.username);
      }
    });

  }
};


exports.emailReset = function(req, res) {
  logger.debug('userId:' + req.body.id);
  var userId = req.body.id;
  User.findById(userId, function(err, user){
    if(err || !user) {
      res.send(403, err);
    } else {
      var url = process.env.HOST_ROOT_URL + '/onBoard?token=' + user.registerToken;
      var check = require('validator').check;
      try {
        check(user.username).isEmail();
        MailService.send({
          subject: 'From siyuanren!!',
          from: 'admin@siyuanren.org',
          to: user.username,
          text: 'Please set your username and password at: ' + url}, function (err, msg) {
          logger.debug(msg);
          if(err) {
            logger.warn('Err of sending: ' + JSON.stringify(err));
            res.send(400, err);
          }
          else {
            return res.send(200, user.username);
          }
        });
      }
      catch (e) {
        res.send(400, "Invalid email");
      }


    }
  });
};


exports.changeHistory = function(req, res) {
  ChangeHistory
    .find({

    })
    .sort({timestamp: -1})
    .limit(20)
    .populate('user')
    .populate('siyuanUserProfile')
    .exec(function(err, docs){
      if(err){
        logger.error(err);
        res.send(400, err);
      } else{
        var histories = [];
        for(var i in docs) {

          var doc = docs[i];
          histories.push({
            timestamp: doc.timestamp.toString(),
            Modifiee: doc.siyuanUserProfile['姓名'],
            Modifier: doc.user.username,
            Change: doc.fieldSet
          });

        }
        res.send(200, histories);
      }
    });
};
