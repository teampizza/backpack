var mongojs = require('mongojs');
var mubsub = require('mubsub');
var netdata_client = mubsub('mongodb://localhost:27017/backpack');
var alertdb = mongojs.connect('localhost:27017/backpack', ['alerts']);

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
		model_socialbeacon(newdata);
});


// TODO move this out to model dir
function model_socialbeacon(netdata) {
		// TODO test input, fail gracefully
		// e.g. for protocol, etc.
		var testdata = netdata.link.ip.tcp.data;

		// things we want to match
		sourcematcher = /connect.facebook.net/;
		referermatcher = /Referer: (.*)/;
		// output-use vars
		var referer;

		// do the matching
		// TODO refactor, tests can be combined
		if (testdata && sourcematcher.test(testdata.toString())) {
				console.log(testdata.toString());
				
				if (referermatcher.test(testdata.toString())) {
						referer = referermatcher.exec(testdata.toString())[1];
						console.log(referer);
						
						// save to alerts DB
						// TODO break this out into another function
						alertdb.alerts.save({msg: referer,
																 created_date: Date.now()
																});
				}
		}
}
