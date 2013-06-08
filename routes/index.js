
/*
 * GET home page.
 */
TITLE = 'Siyuan Ren'

exports.index = function(req, res){
  res.render('index', { title: TITLE });
};
exports.peopletable = function(req, res){
  res.render('peopletable', { title: TITLE });
};
exports.login = function(req, res){
  res.render('login', { title: TITLE });
};
exports.logout = function(req, res){
  res.render('logout', { title: TITLE });
};
exports.profile = function(req, res){
  res.render('profile', { title: TITLE });
};
exports.query = function(req, res){
  res.render('query', { title: TITLE });
};

