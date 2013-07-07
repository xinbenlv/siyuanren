
var mongoose = require('mongoose');
var logger = require('log4js').getDefaultLogger();
var SiyuanUserProfile = require('./server/models/SiyuanUserProfile');
var User = require('./server/models/User');
var userRoles = require('./client/js/routingConfig').userRoles;

mongoose.connect(process.env.MONGOHQ_DEV_URL || process.env.MONGOHQ_DEV_URL, function(err) {
  if(err){
    logger.debug('Error!: ' + err.toString());
  } else {
  /*
    User.find({registerToken:{$exists: true}}, function(err, users) {
      for(var i in users) {
        user = users[i];

        console.log('removing user: ' + user.username);
        user.remove();
      }
    });
  */
    SiyuanUserProfile.find({
      // '姓名':'周载南'

    }, function(err, docs){

      for(var i in docs){
        var doc = docs[i];
        if (doc['常用邮箱'].length > 0 ){
          var t = {};
          t.address = doc['常用邮箱'];
          t.notes = '常用';
          doc['Emails'].push(t);
        }
        if (doc['其他邮箱'].length > 0 ){
          var emails = doc['其他邮箱'].split(',');
          for(var j in emails) {
            var email = emails[j];
            if(email.length > 0) {
              var t = {};
              t.address = emails[j];
              t.notes = '其他邮箱';
              doc['Emails'].push(t);
            }
          }
        }
        if(doc['手机'].length > 0) {
          var phoneNumbers = doc['手机'].split(',');
          for(var j in phoneNumbers) {
            var ph = phoneNumbers[j];
            if (ph && ph.length > 0) {
              var countryCodeMatcher = /(?:\(\+)(\d+)(?:\))/;
              var phoneNumberMatcher = /([\d\-\s]{7,15})/;
              var notesMatcher = /(?:\[)(.*)(?:\])/;

              var countryCode = ph.match(countryCodeMatcher) && ph.match(countryCodeMatcher)[1];
              var phone =  ph.match(phoneNumberMatcher)[1].replace(/\-/g,'').replace(/ /g,'');
              var notes = ph.match(notesMatcher) && ph.match(notesMatcher)[1];
              if (phone == null) {
              } else {
                var t = {};
                if(countryCode)  t.countryCode = countryCode;
                else t.countryCode = '86';
                t.phoneNumber = phone;
                t.notes = notes || '';
                doc['Phone Numbers'].push(t);
              }
            }
          }
        }
        doc.save(function(err) {
          if(err) logger.debug('save result: ' + err + ', doc: ' + JSON.stringify(dd['手机']) + ', tt: ' + JSON.stringify(tt));
        });

        var username =doc['Emails'].length > 0 ? doc['Emails'][0].address : doc['姓名'];
        logger.info('Creating username: ' + username);
        User.register({
            username: username,
            registerToken: require("randomstring").generate(32),
            siyuanid: doc.id,
            role: userRoles.user,
          },
          require("randomstring").generate(32), function(err, user){
          if(err) logger.debug(err);
          else {
            logger.info('Successfully created user: ' + user.username);
          }
        });
      }
    });
  }
});