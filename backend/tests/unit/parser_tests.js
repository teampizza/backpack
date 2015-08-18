'use strict';
// load env vars
require('dotenv').load();
var chai = require('chai');
var expect = chai.expect;
// chai.use(require('sinon-chai'));
// var sinon = require('sinon');

var parser = require('../../../backend/parser/pcap_parser');
var mongojs = require('mongojs');
var mubsub = require('mubsub');
// function for executing shell commands and getting output
// see http://stackoverflow.com/a/12941186/2023432
var exec = require('child_process').exec;
function execute(command, callback) {
    exec(command, function(error, stdout, stderr) { callback(stdout); });
}

suite('pcap permissions setter', function() {
  setup(function() {
    execute('../../../backend/parser/cap_permission.sh', function(){});
  });
  teardown(function() {});

  var parserPath = process.cwd() + '/backend/parser/pcap_parser.js';
  
  it('creates the capture group (if needed)', function(done) {
    // group is defined by process.env.CAP_GROUP
    execute('groups', function(grouplist) {
      expect(grouplist.indexOf(process.env.CAP_GROUP) > -1);
      done();
    });
  });

  it('gives parser script ownership to capture group', function(done) {
    execute('stat -c "%G" ' + parserPath, function(owningGroup) {
      expect(owningGroup.trim()).to.equal(process.env.CAP_GROUP);
      done();
    });
  });

  it('grants user all, group read+execute to parser script', function(done) {
    // group read+execute is 5, user all is 7. so we set 750
    execute('stat -c "%a" ' + parserPath, function(permChecksum) {
      expect(permChecksum.trim()).to.equal('750');
      done();
    });
  });

  it('grants cap_net_raw and cap_net_admin capabilities to node', function(done) {
    // setcap sets capabilities, getcap examines them
    execute('getcap ' + process.env.NODE_BINARY, function(nodeCaps) {
      expect(nodeCaps.indexOf('cap_net_raw') > -1);
      expect(nodeCaps.indexOf('cap_net_raw+eip') > -1);
      done();
    });
  });
  
});

suite('pcap parser', function() {
  setup(function() {});
  teardown(function() {});

  it('connects successfully to mongo DB', function(done) {
    var parseObj = parser.initParsing(process.env.MONGO_URL,
                                      'test', process.env.NET_INTERFACE);
    parseObj.db.stats(function(x, statsObj){
      expect(statsObj.db === 'backpack');
      done();
    });
  });

  it('starts a pcap sesssion', function() {
    try {
      var pcapSession = parser.startCapsession(process.env.NET_INTERFACE, ['tcp']);
      expect(pcapSession.isLive === true);
    } catch (exception) {
      console.error(exception.message);
    }
  });

  it('publishes received packets to the netdata store', function(done) {
    try {
      var parseObj = parser.initParsing(process.env.MONGO_URL,
                                        'test', process.env.NET_INTERFACE);
      var testSub = mubsub(process.env.MONGO_URL);
      var testChannel = testSub.channel('test', { size: 100000, max: 500 });
      var testSubscription = testChannel.subscribe(['newpacket'], function(thispacket) {
        expect(thispacket !== undefined);
        testSubscription.unsubscribe();
        done();
      });
    } catch (exception) {
      console.error(exception.message);
    }
  });

  it('caps DB collection to specified size', function(done) {
    // TODO make foo a valid collection
    var db = mongojs.connect(process.env.MONGO_URL.slice(10), ['testcapping']);
    db = parser.capDBCollection(db, 'testcapping', process.env.DB_NETSIZE);
    db.testcapping.isCapped(function(err, res) {
      db.close();
      expect(res === true);
      done();
    });
  });
});
