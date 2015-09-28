'use strict';
var mongojs = require('mongojs');
var mubsub = require('mubsub');
var async = require('async');
// load env vars
require('dotenv').load();
// bring up modeler components
// returns subscription to alerts with insert
function initModeler(dataURL, alertURL, modelDir) {
	// defaults
  var defaultDataURL = process.env.MONGO_URL;
  // TODO document or fix this fucking ass-schema
  var defaultAlertDB = [process.env.MONGO_URL.slice(10), ['alerts']];
  var defaultModelDir = process.cwd() + '/backend/modeler/models/';

	modelDir = (modelDir !== undefined ? modelDir : defaultModelDir);
	alertURL = (alertURL !== undefined ? alertURL : defaultAlertDB);
	dataURL = (dataURL !== undefined ? dataURL : defaultDataURL);

	var alertDB = mongojs.connect(defaultAlertDB);

	var netData = mubsub(dataURL);
	
	// TODO straighten this path tripe out
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
	var subscription = netDataChannel.subscribe('newpacket', function(newData) {
		
		// TODO collect model alerts by iterating through models object asyncly
    async.forEachOf(models, function(thisModel, modelName, errCallback) {
      try {
        var modelAlert = thisModel.model(newData);
        if (modelAlert !== undefined) {
          insertAlerts(modelAlert, alertDB);
        }
        errCallback();
      } catch (err) {
        errCallback(err);
      }
    }, function(error) { // individual model error callbacks
      console.error("Model error: ");
      console.error(error);
    });
	});

  // return info about the subscription
  return {
    models: models,
    dataSubscription: subscription
  };
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
