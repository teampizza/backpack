var mongojs = require('mongojs');
var merge = require('deepmerge');

var db = mongojs.connect('localhost:27017/backpack', ['netdata']);

var pcap = require('pcap');
// environment var name
var ifacevar = 'NET_INTERFACE';
var iface = process.env[ifacevar];


// make sure netdata DB is capped (10Mb here)
// TODO take user options for this
cap_dbcollection(db,'netdata',10000000);

// for now let's do TCP
// TODO take model spec for this
pcap_session = start_capsession(iface, ['tcp']);

// session-based tracking is a higher level
// TODO revisit this
// tcp_tracker = new pcap.TCP_tracker();

// issue -- lots of data that can't be decoded (https, etc.)
// proposed solution:
// store available fields as able, then rely on models to toString() packet data
pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);

		// console.log(packet);
		
		// send to netdata DB
		db.netdata.save(build_payload(packet,'node_pcap'));
});

function start_capsession(net_iface, protocols) {
		// TODO test inputs for validity or catch errors
		// filter syntax comes from 'man pcap-filter'

		// escape protos
		var esc_protocols = protocols.map(function(str) {
				return("\\"+str);
		});
		var protostring = 'ip proto (' + esc_protocols.join(' or ') + ')';
		return(
				pcap.createSession(net_iface,protostring)
		);
}

function build_payload(dataobj,backend_name) {
		backend_name = backend_name || 'node_pcap'; // default arg
		// TODO test to make sure obj is object

		// build object to be stored 
		var payload = {};
		payload.backend = backend_name;
		return(merge(payload,dataobj));
}

function cap_dbcollection(thisdb, collection, dbsize) {
		// util function to check if DB is capped and if not, cap it to user-set
		// size 
    // warning: blocks db write globally while working, should only be run at
		// start

		// TODO tests
		if(! thisdb[collection].isCapped(function(err,res) {return(res)})) {
				thisdb.runCommand({"convertToCapped": collection, size: dbsize});
		}
}
