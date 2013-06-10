/**
 *
 * @type {Array}
 */
var Charlatan = require('charlatan');

var staticData = [
  {name: '刘备', siyuan_year: '3', department: '卖草鞋系', job_title: '皇帝', company: '蜀汉',
    email: 'liubei@shuhan.com', mobile_phone: '+861395438438'},
  {name: '关羽', siyuan_year: '4', department: '卖大枣系', 'job_title': '寿亭侯', company: '蜀汉',
    email: 'guanyu@shuhan.com', mobile_phone: '+861385438438'},
  {name: '张飞', siyuan_year: '5', department: '屠宰系', 'job_title': '车骑将军', company: '蜀汉',
    email: 'zhangfei@shuhan.com', mobile_phone: '+861365438438'}];

var getDynamicData = function(num) {
  data = [];
  for (var i = 0; i < num; i++) {
    name = Charlatan.Name.name();
    email = Charlatan.Internet.email();
    company = Charlatan.Company.name();
    data.push({name: name, email: email, company: company});
  }
  return data;
};

/**
 *
 * @type {{getDynamicData: Function, staticData: *}}
 */
module.exports = { 'getDynamicData': getDynamicData,
  staticData: staticData};

