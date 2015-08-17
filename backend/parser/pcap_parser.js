'use strict';
// load env vars
require('dotenv').load();
var mongojs = require('mongojs');
var mubsub = require('mubsub');
var merge = require('deepmerge');

var db = mongojs.connect(process.env.MONGO_URL.slice(10), ['netdata']);
var netdata = mubsub(process.env.MONGO_URL);
var netdataChannel = netdata.channel('netdata');

var pcap = require('pcap');
// environment var name
var ifacevar = 'NET_INTERFACE';
var iface = process.env[ifacevar];

// make sure netdata DB is capped (10Mb here)
capDBCollection(db,'netdata', process.env.DB_NETSIZE);

// for now let's do TCP
// TODO take model spec for this
var pcapSession = startCapsession(iface, ['tcp']);

// session-based tracking is a higher level
// TODO revisit this
// tcp_tracker = new pcap.TCP_tracker();

// issue -- lots of data that can't be decoded (https, etc.)
// proposed solution:
// store available fields as able, then rely on models to toString() packet data
pcapSession.on('packet', function (rawPacket) {
  var packet = pcap.decode.packet(rawPacket);

	console.log(packet);
	
	// send to netdata DB
	// db.netdata.save(buildPayload(packet,'node_pcap'));
	netdataChannel.publish('newpacket', buildPayload(packet,'node_pcap'));
});

function startCapsession(netIface, protocols) {
	// TODO test inputs for validity or catch errors
	// filter syntax comes from 'man pcap-filter'

	// escape protos
	var escProtocols = protocols.map(function(str) {
		return('\\' + str);
	});
	var protostring = 'ip proto (' + escProtocols.join(' or ') + ')';
	return(
		pcap.createSession(netIface,protostring)
	);
}

function buildPayload(dataobj, backendName) {
	backendName = backendName || 'node_pcap'; // default arg
	// TODO test to make sure obj is object

	// build object to be stored 
	var payload = {};
	payload.backend = backendName;
	return(merge(payload,dataobj));
}

function capDBCollection(thisdb, collection, dbsize) {
	// util function to check if DB is capped and if not, cap it to user-set
	// size 
  // warning: blocks db write globally while working, should only be run at
	// start

	// TODO tests
	if(! thisdb[collection].isCapped(function(err,res) {return(res);})) {
		thisdb.runCommand({'convertToCapped': collection, size: dbsize});
	}
}
