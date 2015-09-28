'use strict';
// original POC, search for Facebook Connect social beacon
// liberally borrowed from
// https://github.com/mranney/node_pcap/blob/master/examples/network_grep.js


// what we're looking for now is the site that referred us to FB

var socialBeacon = function(netData) {
	// TODO test input, fail gracefully
	// e.g. for protocol, etc.

  // socialBeacon
	var testData = netData.link.ip.tcp.data;
  
	// things we want to match
	var sourceMatcher = /connect.facebook.net/;
	var refererMatcher = /Referer: (.*)/;
	// output-use vars
	var referer;

	// do the matching
	// TODO refactor, tests can be combined
	if (testData && sourceMatcher.test(testData.toString())) {
		// console.log(testData.toString());
		if (refererMatcher.test(testData.toString())) {
			referer = refererMatcher.exec(testData.toString())[1];
			// console.log(referer);
			
			// if we pass, return an alert
			// TODO alert spec!!
			return({msg: referer,
							createdDate: Date.now()
						 });
		}
	}
};

module.exports = socialBeacon;
