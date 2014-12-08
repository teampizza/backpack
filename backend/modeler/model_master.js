var mongojs = require('mongojs');
var mubsub = require('mubsub');
var netdata_client = mubsub('mongodb://localhost:27017/backpack');
var alertdb = mongojs.connect('localhost:27017/backpack', ['alerts']);
// TODO import all models through manifest
// TODO straighten this path tripe out
require('./backend/modeler/models/socialbeacon/model.js');
var models = require('include-all')({
  dirname     :  process.cwd() + '/backend/modeler/models',
  filter      :  /(.+)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  optional    :  true
});

var netdata_channel = netdata_client.channel('netdata');
console.log(netdata_channel);

// when a new document is added to netdata, pass it to models
// TODO unify into single model_dispatch function
var netdata_sub = netdata_channel.subscribe(function(newdata) {
		console.log(newdata.toString());
		models.socialbeacon.model(newdata);
});
