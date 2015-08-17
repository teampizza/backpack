'use strict';
// load env vars
require('dotenv').load();
var mongojs = require('mongojs');
var mubsub = require('mubsub');
var netdata = mubsub(process.env.MONGO_URL);
var alertdb = mongojs.connect(process.env.MONGO_URL.slice(10), ['alerts']);
// TODO import all models through manifest
// TODO straighten this path tripe out
require('./models/socialbeacon/model.js');
var models = require('include-all')({
  dirname     :  process.cwd() + '/backend/modeler/models',
  filter      :  /(.+)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  optional    :  true
});

var netdataChannel = netdata.channel('netdata');
// are we up? print
// console.log(netdataChannel);

// when a new document is added to netdata, pass it to models
// TODO unify into single model_dispatch function
netdataChannel.subscribe('newpacket', function(newdata) {
	
	// TODO collect model alerts by iterating through models object asyncly
	var modelalerts = [models.socialbeacon.model(newdata)];
	// save nonempty elements to alerts DB
	// http://stackoverflow.com/a/5443800/2023432
	insertAlerts(modelalerts.filter(Boolean), alertdb);

});

function insertAlerts(objarray, db) {
	// TODO insert response callback
	if (objarray.length > 0) {
		objarray.forEach(function(obj) {
			db.alerts.save(obj);
		});
	}
}
