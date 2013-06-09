var log4js = require('log4js');
var schema = require('./schema');

var logger = log4js.getLogger();

var log = console.log;


/**
 * A function to be called on use request to create data
 * @param {Function} onSuccess to handle successful action.
 */
var onReqCreateData = function(onSuccess) {
  var mongo = require('mongodb');
  mongo.Db.connect(mongoUri, function(err, db) {
    var collection = db.collection('peopletable');
    collection.find().toArray(function(err, ret) {
      var doc = ret[0];
      doc.data.push({ values: {} });
      collection.save(doc, {safe: true}, function() {
        onSuccess(doc);
        db.close();
      });
    });
  });
};

/**
 * A function to be called on use request to update data
 * @param {Object} updateData object as in MongoDB.connection to update data.
 * @param {Function} onSuccess to handle successful action.
 */
var onReqUpdateData = function(updateData, onSuccess) {
  logger.debug('Update data');
  var mongo = require('mongodb');
  mongo.Db.connect(mongoUri, function(err, db) {
    var k = 'data.' + (parseInt(updateData.id) - 1).toString() +
      '.values.' + updateData.colname;
    var v = updateData.newvalue;
    var tmp = {};
    tmp[k] = v;
    var collection = db.collection('peopletable');
    collection.update({ },
      { $set: tmp }, {safe: true}, function(err, ret) {
        onSuccess('ok');
      });
  });
};

/**
 *
 * @param {Object} criteria object as in MongoDB.connection to filter data.
 * @param {Function} onSuccess to handle successful action.
 */
var onReqLoadData = function(criteria, onSuccess) {
  var mongo = require('mongodb');
  mongo.Db.connect(mongoUri, function(err, db) {
    var collection = db.collection('peopletable');
    collection.find().toArray(function(err, ret) {
      onSuccess(ret[0]);
      db.close();
    });
  });
};

/**
 *
 * @param {Object} criteria the critieria of a people to be removed.
 * @param {Function} onSuccess to handle successful action.
 */
var onReqDeleteData = function(criteria, onSuccess) {
  logger.debug('Delete data');
  var id = criteria.id;
  var mongo = require('mongodb');
  mongo.Db.connect(mongoUri, function(err, db) {
    var collection = db.collection('peopletable');
    collection.find().toArray(function(err, ret) {
      var doc = ret[0];
      logger.debug('id: ' + id);
      doc.data.splice(parseInt(id) - 1, 1);
      collection.save(doc, {safe: true}, function() {
        onSuccess(doc);
        db.close();
      });
    });
  });
};

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
  var action = req.query['action'];
  if (action === 'create') {
    logger.debug('create triggered');
    onReqCreateData(function(data) {
      res.send(data);
    });
  } else if (action === 'load') {
    logger.debug('load triggered');
    schema.onReqLoadData(req.query.values, function(data) {
      res.send(data);
    });
  } else if (action === 'delete') {
    logger.debug('delete triggered');
    onReqDeleteData(req.query.values, function(data) {
      res.send(data);
    });
  } else if (action === 'update') {
    logger.debug('update triggered');
    onReqUpdateData(req.query.values, function(data) {
      res.send(data);
    });
  }
};



