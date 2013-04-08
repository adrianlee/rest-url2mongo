// Load Modules
var mongoose = require('mongoose');

// Connect to external mongodb instance
mongoose.connect('mongodb://ecse:123@widmore.mongohq.com:10000/ecse489');

module.exports = db = {};

// Schema-less collections by setting strict to false
var Schema = new mongoose.Schema(null, { strict: false });

// Dynamic Retrieval of Collection Name
db.get = function (collection) {
  return mongoose.model(collection, Schema);
};