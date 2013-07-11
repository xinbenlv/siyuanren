'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var EmailType = require('./EmailType');
var PhoneNumberType = require('./PhoneNumberType');

var SiyuanUserProfile = new Schema({
  "思源学员期数": {type: String, 'Chinese Label': '思源学员期数'},
  "担任辅导员": [String],
  "姓名": String,
  "常用邮箱": String,
  "其他邮箱": String,
  "手机": String,
  "Emails": [EmailType],
  "Phone Numbers": [PhoneNumberType],
  "性别": String,
  "本科班级": String,
  "本科院系": String,
  "研究生阶段学校院系": String,
  "常驻国家": String,
  "省份": String,
  "常驻城市": String,
  "邮政编码": String,
  "目前单位": String,
  "目前职位": String,
  MSN: String,
  "出生日期": String,
  "Tshirt尺码": String,
  "新浪微博": String,
  "通讯地址": String,
  "微信": String,
  QQ: String,
  LinkedIn: String,
  Facebook: String,
  Dropbox: String,
  Skype: String,
  Gtalk: String,
  "备注": String
});

/**
 *
 * @type {User} a model of user
 */
module.exports = mongoose.model('SiyuanUserProfile', SiyuanUserProfile);
