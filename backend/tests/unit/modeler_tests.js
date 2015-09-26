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

var modelMaster = require('../../../backend/parser/model_master');
var mongojs = require('mongojs');
var mubsub = require('mubsub');

suite('model init', function() {
  setup(function() {
    // execute('../../../backend/parser/cap_permission.sh', function(){});
  });
  teardown(function() {});

  it('loads as many model functions as are in models dir', function() {});

  it('subscribes to netdata collection', function() {});

  it('connects to alerts db', function() {});

  // TODO generate mock data for these, matching models
  it('it produces alert objects matching spec', function() {});

  it('inserts alerts into alerts db', function() {});
});
