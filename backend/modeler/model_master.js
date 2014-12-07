var mongojs = require('mongojs');
var netdatadb = mongojs.connect('localhost:27017/backpack', ['netdata']);
var alertdb = mongojs.connect('localhost:27017/backpack', ['alerts']);

// original POC, search for Facebook Connect social beacon
// liberally borrowed from
// https://github.com/mranney/node_pcap/blob/master/examples/network_grep.js

// TODO poll netdata DB

sourcematcher = /connect.facebook.net/;
referermatcher = /Referer: (.*)/;


// TODO replace with queries to netdata
// TODO break this out to a sub-model process
// what we're looking for now is the site that referred us to FB
var referer;

if (data && sourcematcher.test(data.toString())) {
    console.log(pcap.print.packet(packet));
    // console.log(data.toString());
		
		if (referermatcher.test(data.toString())) {
				referer = referermatcher.exec(data.toString())[1];
				console.log(referer);
				
				// save to alerts DB
				// TODO no changes here
				alertdb.alerts.save({msg: referer,
														 created_date: Date.now()
														});
		}
}
