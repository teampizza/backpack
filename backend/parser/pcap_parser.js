var mongojs = require('mongojs');
var db = mongojs.connect('localhost:27017/backpack', ['alerts']);

var pcap = require('pcap');
// environment var name
var ifacevar = 'NET_INTERFACE';
var iface = process.env[ifacevar];

// TODO soon we will want to provide a modular way of filtering to sort
// traffic by model needs
// filter syntax comes from 'man pcap-filter'

// for now let's do TCP/HTTP
pcap_session = pcap.createSession(iface, "ip proto \\tcp");
tcp_tracker = new pcap.TCP_tracker();

// original POC, search for Facebook Connect social beacon
// liberally borrowed from
// https://github.com/mranney/node_pcap/blob/master/examples/network_grep.js
sourcematcher = /connect.facebook.net/;
referermatcher = /Referer: (.*)/;
// console.log("Listening on " + pcap_session.device_name);

// what we're looking for now is the site that referred us to FB
var referer;
pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet),
        data = packet.link.ip.tcp.data;

    if (data && sourcematcher.test(data.toString())) {
        console.log(pcap.print.packet(packet));
        // console.log(data.toString());

				if (referermatcher.test(data.toString())) {
						referer = referermatcher.exec(data.toString())[1];
						console.log(referer);

						// save to DB
						db.alerts.save({msg: referer,
														created_date: Date.now()
														});
				}
    }
});
