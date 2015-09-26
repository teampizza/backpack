'use strict';
// load env vars
require('dotenv').load();
var mongojs = require('mongojs');
var mubsub = require('mubsub');
var defaultNetdata = mubsub(process.env.MONGO_URL);
// TODO document or fix this fucking ass-schema
var defaultAlertDB = [process.env.MONGO_URL.slice(10), ['alerts']];
var defaultModelDir = process.cwd() + '/backend/modeler/models';

// bring up modeler components
// returns subscription to alerts with insert
function initModeler(dataURL, alertURL, modelDir) {
	// defaults
	modelDir = (modelDir !== undefined ? modelDir : defaultModelDir);
	alertURL = (alertURL !== undefined ? alertURL : defaultAlertDB);
	dataURL = (dataURL !== undefined ? dataURL : defaultNetdata);

	var alertDB = mongojs.connect(defaultAlertDB[0], defaultAlertDB[1]);
	var netData = mubsub(dataURL);
	
	// TODO import all models through manifest
	// TODO straighten this path tripe out
	// require('./models/socialbeacon/model.js');
	var models = require('include-all')({
		dirname			:	 modelDir,
		filter			:	 /(.+)\.js$/,
		excludeDirs :	 /^\.(git|svn)$/,
		optional		:	 true
	});

	var netDataChannel = netData.channel('netdata');
	// are we up? print
	// console.log(netDataChannel);

	// when a new document is added to netdata, pass it to models
	// TODO unify into single model_dispatch function
	return netDataChannel.subscribe('newpacket', function(newData) {
		
		// TODO collect model alerts by iterating through models object asyncly
		var modelAlerts = [models.socialbeacon.model(newData)];
		// save nonempty elements to alerts DB
		// http://stackoverflow.com/a/5443800/2023432
		insertAlerts(modelAlerts.filter(Boolean), alertDB);
	});
}

function insertAlerts(objarray, db) {
	// TODO insert response callback
	if (objarray.length > 0) {
		objarray.forEach(function(obj) {
			db.alerts.save(obj);
		});
	}
}

module.exports = {
  initModeler : initModeler
};
