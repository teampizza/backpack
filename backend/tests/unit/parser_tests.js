'use strict';
// load env vars
require('dotenv').load();
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

// function for executing shell commands and getting output
// see http://stackoverflow.com/a/12941186/2023432
var exec = require('child_process').exec;
function execute(command, callback) {
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};



suite('pcap permissions setter', function() {
  setup(function() {});
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
      expect(owningGroup).to.equal(process.env.CAP_GROUP);
      done();
    });
  });

  it('grants user all, group read+execute to parser script', function(done) {
    // group read+execute is 5, user all is 7. so we set 750
    execute('stat -c "%a" ' + parserPath, function(permChecksum) {
      expect(permChecksum).to.equal(750);
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
  
});
