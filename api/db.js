

var mongo = require('mongodb');
var mongoUri = process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
var COLLECTION_NAME = 'siyuanren';

/**
 * Initialize database
 * @param {string} k for key to insert.
 * @param {object} v for data to insert with the key.
 * @param {function} onSuccess callback of a successful insertion.
 * @param {function} onError callback of a failure with error.
 */
exports.insert = function(k, v, onSuccess, onError) {
  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection(COLLECTION_NAME, function(er, collection) {
      collection.insert(v, {safe: true},
        function(er, rs) {
          if (er != null) {
            onError(er);
          }
        });
    });
  });
}







