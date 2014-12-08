var mongojs = require('mongojs');
var mubsub = require('mubsub');
var netdata = mubsub('mongodb://localhost:27017/backpack');
var alertdb = mongojs.connect('localhost:27017/backpack', ['alerts']);
// TODO import all models through manifest
// TODO straighten this path tripe out
require('./models/socialbeacon/model.js');
var models = require('include-all')({
  dirname     :  process.cwd() + '/backend/modeler/models',
  filter      :  /(.+)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  optional    :  true
});

var netdata_channel = netdata.channel('netdata');
// are we up? print
// console.log(netdata_channel);

// when a new document is added to netdata, pass it to models
// TODO unify into single model_dispatch function
netdata_channel.subscribe('newpacket', function(newdata) {
	
	// TODO collect model alerts by iterating through models object asyncly
	var modelalerts = [models.socialbeacon.model(newdata)];
	// save nonempty elements to alerts DB
	// http://stackoverflow.com/a/5443800/2023432
	insert_alerts(modelalerts.filter(Boolean), alertdb);

});

function insert_alerts(objarray, db) {
	// TODO insert response callback
	if (objarray.length > 0) {
		objarray.forEach(function(obj) {
			db.alerts.save(obj)
		});
	}
}
