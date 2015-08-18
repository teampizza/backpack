'use strict';
// load env vars
require('dotenv').load();
var mongojs = require('mongojs');
var mubsub = require('mubsub');
var merge = require('deepmerge');
var pcap = require('pcap');
var iface = process.env.NET_INTERFACE;

// initParsing(process.env.MONGO_URL, 'netdata', iface);

// the main function that does all the work
function initParsing(dbURL, tableName, netIface) {
  // make sure netdata DB is capped (10Mb here)
  var db = mongojs.connect(dbURL.slice(10), [tableName]);
  capDBCollection(db, tableName, process.env.DB_NETSIZE);

  var netdata = mubsub(process.env.MONGO_URL);
  var netdataChannel = netdata.channel(tableName);

  // for now let's do TCP
  // TODO take model spec for this
  var pcapSession = startCapsession(netIface, ['tcp']);

  // session-based tracking is a higher level
  // TODO revisit this
  // tcp_tracker = new pcap.TCP_tracker();

  // issue -- lots of data that can't be decoded (https, etc.)
  // proposed solution:
  // store available fields as able, then rely on models to toString() packet
  // data
  pcapSession.on('packet', function (rawPacket) {
    var packet = pcap.decode.packet(rawPacket);
    
    // send to netdata DB
    // db.netdata.save(buildPayload(packet,'node_pcap'));
    netdataChannel.publish('newpacket', buildPayload(packet,'node_pcap'));
  });
}

function startCapsession(netIface, protocols) {
  // TODO test inputs for validity or catch errors
  // filter syntax comes from 'man pcap-filter'

  // escape protos
  var escProtocols = protocols.map(function(str) {
    return('\\' + str);
  });
  var protostring = 'ip proto (' + escProtocols.join(' or ') + ')';
  return(pcap.createSession(netIface,protostring));
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

  thisdb[collection].isCapped(function(err,res) {
    if(res === false) {
      thisdb.runCommand({'convertToCapped': collection, size: dbsize});
    }
  });
  return thisdb;
}

module.exports = {
  initParsing: initParsing,
  startCapsession: startCapsession,
  buildPayload: buildPayload,
  capDBCollection: capDBCollection
};
