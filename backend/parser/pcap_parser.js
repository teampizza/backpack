var mongojs = require('mongojs');
var db = mongojs.connect('localhost:27017/backpack', ['netdata']);

var pcap = require('pcap');
// environment var name
// var iface = "wlan0";
var ifacevar = 'NET_INTERFACE';
var iface = process.env[ifacevar];

// filter syntax comes from 'man pcap-filter'

// for now let's do TCP/HTTP
pcap_session = pcap.createSession(iface, "ip proto \\tcp");
tcp_tracker = new pcap.TCP_tracker();


referermatcher = /Referer: (.*)/;
// TODO get this into a field-separated JSON
// issue -- lots of data that can't be decoded (https, etc.)
// proposed solution:
// store available fields as able, then rely on models to toString() packet data
pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
		var data = packet.link.ip.tcp.data;
		// if (data && referermatcher.test(data.toString())) {
		// 		console.log(data.toString());
		// 		// console.log(pcap.print.packet(packet));
		// }
		// console.log(JSON.stringify(packet));
});

// TODO put it into netdata
