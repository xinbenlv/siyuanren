/**
 * Created with JetBrains WebStorm.
 * User: zzn
 * Date: 6/9/13
 * Time: 9:27 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// TODO(zzn) extends a data
var SiyuanUserProfile = new Schema({
  email: String,
  siyuan_year: String, //思源学员期数
  mentor_of_siyuan_year: [], //期内职位
  name: String, // 姓名
  gender: String, // 性别
  department: String, //院系
  mail_address: {
    country: String,
    state: String,
    city: String,
    line1: String,
    line2: String,
    zip_code: String
  },
  company: String,  // 目前单位
  job_title: String, // 目前职位
  mobile_phone: String, // 手机
  land_line: String, // 固定电话
  birthday: Date, //
  t_shirt_size: String, //T-shirt尺码
  notes: String //备注
});

/**
 *
 * @type {User} a model of user
 */
module.exports = mongoose.model('SiyuanUserProfile', SiyuanUserProfile);
