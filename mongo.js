var mongoose = require('mongoose');
mongoose.connect('mongodb://ecse:123@widmore.mongohq.com:10000/ecse489');

module.exports = db = {};

var Schema = new mongoose.Schema(null, { strict: false });

db.get = function (collection) {
  return mongoose.model(collection, Schema);
};