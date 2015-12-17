var _ = require('lodash');

var localEnvVars = {
  TITLE:      'Bucket List',
  SAFE_TITLE: 'bucket_list'
};

var superSecret = "afishcalledwanda";

// Merge all environmental variables into one object.
//module.exports = _.extend(process.env, localEnvVars);
module.exports = {
  localEnvVars: localEnvVars,
  superSecret: superSecret
}
