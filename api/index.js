var log4js = require('log4js');
var logger = log4js.getLogger();

var log = console.log;
var USERNAME = 'testuser';
var PASSWORD = 'testpass';
var MONGO_HOST = 'alex.mongohq.com';
var MONGO_PORT = '10077';
var MONGO_DBNAME = 'app14616351';
var MONGO_LOCAL_URL = 'mongodb://' +
  USERNAME + ':' + PASSWORD +
  '@' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DBNAME;
var mongoUri = process.env.MONGOHQ_URL || MONGO_LOCAL_URL;

var loadData = function() {
  var metadata = [
    { name: 'name', label: 'NAME', datatype: 'string', editable: true},
    { name: 'year', label: 'YEAR', datatype: 'integer', editable: true},
    { name: 'dept', label: 'DEPT', datatype: 'string', editable: true},
    { name: 'job', label: 'JOB', datatype: 'string', editable: true},
    { name: 'residency city', label: 'RESIDENCY CITY',
      datatype: 'string', editable: true},
    { name: 'action', datatype: 'html', editable: false }
  ];

  var data = [
    { id: 1, values: {
      name: '刘备', year: '158', dept: '卖草鞋系', job: '蜀汉 皇帝',
      'residency city': 'Zhuzhou, Hebei, China', action: '1'}
    },
    { id: 2, values: {
      name: '关羽', year: '160', dept: '卖大枣系', job: '蜀汉 寿亭侯',
      'residency city': 'Yuncheng, Shanxi, China', action: '1'}
    },
    { id: 3, values: {
      name: '张飞', year: '163', dept: '卖肉系', job: '蜀汉 车骑将军',
      'residency city': 'Zhuzhou, Hebei, China', action: '1'}}
  ];

  var tableData = {};
  tableData['metadata'] = metadata;
  tableData['data'] = data;
  return tableData;
};

/**
 *
 * @deprecated Use query of people table.
 *
 * Method handling a normal query.
 *
 * @param {object} req Request for a query.
 * @param {object} res Response for a query.
 */
exports.query = function(req, res) {
  req.accepts(['html', 'json']);
  //console.log(req);

  var sampleTableData = {
    'headers': ['name', 'year', 'dept', 'job', 'residency city'],
    'rows': [
      ['刘备', '158', '卖草鞋系', '蜀汉 皇帝', 'Zhuzhou, Hebei, China'],
      ['关羽', '160', '卖大枣系', '蜀汉 寿亭侯', 'Yuncheng, Shanxi, China'],
      ['张飞', '163', '卖肉系', '蜀汉 车骑将军', 'Zhuzhou, Hebei, China']
    ]
  };

  res.send(sampleTableData);
};


/**
 *
 * Method handling a normal peoplequery.
 *
 * @param {object} req Request for a query.
 * @param {object} res Response for a query.
 */
exports.peopletable = function(req, res) {
  req.accepts(['html', 'json']);
  if ('query' in req && 'tablename' in req.query) {
    // TODO(zzn): use QMongDB as promises.
    var mongo = require('mongodb');
    mongo.Db.connect(mongoUri, function(err, db) {
      var k = 'data.' + (parseInt(req.query.id) - 1).toString() +
        '.values.' + req.query.colname;
      var v = req.query.newvalue;
      var tmp = {};
      tmp[k] = v;
      logger.debug('tmp = ' + JSON.stringify(tmp));
      var collection = db.collection('peopletable');
      collection.update({ },
        { $set: tmp }, {safe: true}, function(err, ret) {
        logger.debug(err);
        logger.debug(ret);
        res.send('ok');
      });
    });

  } else {
    // TODO(zzn): use QMongDB as promises.
    var mongo = require('mongodb');
    console.log('DBG: mongoUri=' + mongoUri);
    mongo.Db.connect(mongoUri, function(err, db) {
      var collection = db.collection('peopletable');
      collection.find().toArray(function(err, ret) {
        logger.debug(JSON.stringify(ret[0]));
        res.send(ret[0]);
        db.close();
      });
    });

  }
};



