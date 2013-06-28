'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var AuthCtrl = require('../../controllers/auth');
var User = require('../../models/User');


describe('Auth controller', function() {

    var req = { }
        , res = {}
        , next = {}
        , sandbox = sinon.sandbox.create();

    beforeEach(function() {

    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('register()', function() {

        beforeEach(function() {
            req.body = {
                username: "user",
                password: "pass",
                role: 1
            };
        });

    });
});