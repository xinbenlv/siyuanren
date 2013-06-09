/**
 * Created with JetBrains WebStorm.
 * User: zzn
 * Date: 6/9/13
 * Time: 8:28 AM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var logger = require('log4js').getLogger();
var Schema = mongoose.Schema;

var USERNAME = 'testuser';
var PASSWORD = 'testpass';
var MONGO_HOST = 'alex.mongohq.com';
var MONGO_PORT = '10077';
var MONGO_DBNAME = 'app14616351';
var MONGO_LOCAL_URL = 'mongodb://' +
  USERNAME + ':' + PASSWORD +
  '@' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DBNAME;
var mongoUri = process.env.MONGOHQ_URL || MONGO_LOCAL_URL;
mongoose.connect(mongoUri);

var siyuanUserProfileSchema = Schema({
  name: String,
  year: Number,
  job: String,
  dept: String,
  city: String
});

/**
 * Get Row Data for it to be displayed in EditableGrid.
 *
 * @this a instance of {SiyuanUserProfile}
 *
 * @param {Integer} id An Id representing the Id to generate.
 * @return {{id: *, values: {name: *, year: *, job: *, dept: *, city: *}}}
 * Row dataData.
 */
siyuanUserProfileSchema.methods.getEditableGridRowData = function(id) {
  return {
    id: id,
    values: {
      name: this.name,
      year: this.year,
      job: this.job,
      dept: this.dept,
      city: this.city,
      action: 1 // Just to show the delete bar
    }
  };
};



var SiyuanUserProfile = mongoose.model('SiyuanUserProfile',
  siyuanUserProfileSchema);


var siyuanUserProfileMetaData = [
  { name: 'name', label: 'NAME', datatype: 'string', editable: true},
  { name: 'year', label: 'YEAR', datatype: 'integer', editable: true},
  { name: 'dept', label: 'DEPT', datatype: 'string', editable: true},
  { name: 'job', label: 'JOB', datatype: 'string', editable: true},
  { name: 'city', label: 'CITY', datatype: 'string', editable: true},
  { name: 'action', datatype: 'html', editable: false }
];

var dataList = [{name: '刘备', year: '158', dept: '卖草鞋系', job: '蜀汉 皇帝',
  'city': 'Zhuzhou, Hebei, China'},
  {name: '关羽', year: '160', dept: '卖大枣系', job: '蜀汉 寿亭侯',
    'city': 'Yuncheng, Shanxi, China'},
  {name: '张飞', year: '163', dept: '卖肉系', job: '蜀汉 车骑将军',
    'city': 'Zhuzhou, Hebei, China'}];

/**
 * Creates sample data
 */
exports.createSampleData = function() {

  logger.debug('creating schema');
  SiyuanUserProfile.create(dataList, function(err) {
    if (err) logger.warn(err);
    else logger.debug('created:');
  });
};

/**
 *
 * @param {Object} criteria object as in MongoDB.connection to filter data.
 * @param {Function} onSuccess to handle successful action.
 */
exports.onReqLoadData = function(criteria, onSuccess) {
  SiyuanUserProfile.find(criteria, function(err, docs) {
    if (!err) {
      var data = [];
      for (var i = 0; i < docs.length; i++) {
        data.push(docs[i].getEditableGridRowData(i));
      }
      onSuccess({metadata: siyuanUserProfileMetaData,
        data: data});
    }
  });
};
