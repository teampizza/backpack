'use strict';
// original POC, search for Facebook Connect social beacon
// liberally borrowed from
// https://github.com/mranney/node_pcap/blob/master/examples/network_grep.js


// what we're looking for now is the site that referred us to FB

var socialbeacon = function(netdata) {
	// TODO test input, fail gracefully
	// e.g. for protocol, etc.
	var testdata = netdata.link.ip.tcp.data;

	// things we want to match
	var sourcematcher = /connect.facebook.net/;
	var referermatcher = /Referer: (.*)/;
	// output-use vars
	var referer;

	// do the matching
	// TODO refactor, tests can be combined
	if (testdata && sourcematcher.test(testdata.toString())) {
		// console.log(testdata.toString());
		
		if (referermatcher.test(testdata.toString())) {
			referer = referermatcher.exec(testdata.toString())[1];
			// console.log(referer);
			
			// if we pass, return an alert
			// TODO alert spec!!
			return({msg: referer,
							createdDate: Date.now()
						 });
		}
	}
}

module.exports = socialbeacon;
