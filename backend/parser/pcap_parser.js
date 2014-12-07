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

// TODO get this into a field-separated JSON
pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
		data = packet.link.ip.tcp.data;
		if (data) {
				console.log(data.toString());
				// console.log(pcap.print.packet(packet));
		}
});

// TODO put it into netdata
