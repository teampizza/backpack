var mongojs = require('mongojs');
var mubsub = require('mubsub');
var netdata_client = mubsub('mongodb://localhost:27017/backpack');
var alertdb = mongojs.connect('localhost:27017/backpack', ['alerts']);
// TODO import all models through manifest
// TODO straighten this path tripe out
// var model_socialbeacon = require('./backend/modeler/models/socialbeacon/model.js');
var models = require('include-all')({
  dirname     :  process.cwd() + '/backend/modeler/models',
  filter      :  /(.+)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  optional    :  true
});

// original POC, search for Facebook Connect social beacon
// liberally borrowed from
// https://github.com/mranney/node_pcap/blob/master/examples/network_grep.js

// TODO poll netdata DB

// TODO break this out to a sub-model process
// what we're looking for now is the site that referred us to FB

var netdata_channel = netdata_client.channel('netdata');
console.log(netdata_channel);

// when a new document is added to netdata, pass it to models
// TODO unify into single model_dispatch function
var netdata_sub = netdata_channel.subscribe(function(newdata) {
		console.log(newdata.toString());
		models.socialbeacon.model(newdata);
});
