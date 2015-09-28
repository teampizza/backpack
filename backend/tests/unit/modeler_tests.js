// tests for model_master

// tests for individual models
// since each model should fit the same spec, we map the same tests to all
'use strict';
// load env vars
require('dotenv').load();
var chai = require('chai');
var expect = chai.expect;
// chai.use(require('sinon-chai'));
// var sinon = require('sinon');
var fs = require('fs');
var modelMaster = require('../../../backend/modeler/model_master');

suite('model init', function() {
  setup(function() {
    // execute('../../../backend/parser/cap_permission.sh', function(){});
  });
  teardown(function() {});

  it('loads as many model functions as are in models dir', function() {
    // not actually the model functions but the subdirs containing the files
    // that...anyway
    var modelList = fs.readdirSync('./backend/modeler/models');
    var modelInstance = modelMaster.initModeler();
    expect(modelInstance.models.length === modelList.length);
  });

  it('subscribes to netdata collection', function() {
    var modelInstance = modelMaster.initModeler();
    expect(modelInstance.dataSubscription);
  });

  it('connects to alerts db', function() {
    expect(false).to.be.true;
  });

  // TODO generate mock data for these, matching models
  it('it produces alert objects matching spec', function() {
    expect(false).to.be.true;
  });

  it('inserts alerts into alerts db', function() {
    expect(false).to.be.true;
  });
});
