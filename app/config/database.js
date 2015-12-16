var mongoose = require('mongoose');

var env = require('./environment');

// Use different database URIs based on whether an env var exists.
var dbUri = env.MONGOLAB_URI || 'mongodb://localhost/' + env.SAFE_TITLE;
dbUri = 'mongodb://localhost/' + env.SAFE_TITLE;

if (!env.MONGOLAB_URI) {
  // check that MongoD is running...
  require('net').connect(27017, 'localhost').on('error', function() {
    console.log("YOU MUST BOW BEFORE THE MONGOD FIRST, MORTAL!");
    exit(0);
  });
}

mongoose.connect(dbUri, function() {
  console.log(`connected to ${dbUri}`);
});

module.exports = mongoose;
