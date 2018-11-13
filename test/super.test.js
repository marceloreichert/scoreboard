'use strict';

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const db = require('../models/db.js');
const sinon = require("sinon");

chai.use(chaiHttp);

require('dotenv').config();

describe('Test Endpoints', function() {

  let database = null;
  let gistId = null;

  before(function(done) {
    db.connection().then(function(db) {
      database = db;
      return database.dropDatabase();
    }).then(function() {}).then(done, done);
  });

  it('POST /api/scoreboard queue 1', function(done) {
    chai.request(app)
      .post('/api/scoreboard')
      .send({user: 1, problem: 2, time: 10, status: 'I'})
      .end(function(err, res) {
        expect(res.status).to.be.equal(200);

        expect(res.body.queue.user).to.be.equal(1);
        expect(res.body.queue.problem).to.be.equal(2);
        expect(res.body.queue.time).to.be.equal(10);
        expect(res.body.queue.status).to.be.equal("I");

        expect(res.body.score.user).to.be.equal(1);
        expect(res.body.score.problems).to.be.equal(0);
        expect(res.body.score.penalty).to.be.equal(20);
        done();
      });
  });

  it('POST /api/scoreboard queue 2', function(done) {
    chai.request(app)
      .post('/api/scoreboard')
      .send({user: 3, problem: 1, time: 11, status: 'C'})
      .end(function(err, res) {
        expect(res.status).to.be.equal(200);

        expect(res.body.queue.user).to.be.equal(3);
        expect(res.body.queue.problem).to.be.equal(1);
        expect(res.body.queue.time).to.be.equal(11);
        expect(res.body.queue.status).to.be.equal("C");

        expect(res.body.score.user).to.be.equal(3);
        expect(res.body.score.problems).to.be.equal(1);
        expect(res.body.score.penalty).to.be.equal(11);
        done();
      });
  });

  it('POST /api/scoreboard queue 3', function(done) {
    chai.request(app)
      .post('/api/scoreboard')
      .send({user: 1, problem: 2, time: 19, status: 'R'})
      .end(function(err, res) {
        expect(res.status).to.be.equal(200);

        expect(res.body.queue.user).to.be.equal(1);
        expect(res.body.queue.problem).to.be.equal(2);
        expect(res.body.queue.time).to.be.equal(19);
        expect(res.body.queue.status).to.be.equal("R");

        done();
      });
  });

  it('POST /api/scoreboard queue 4', function(done) {
    chai.request(app)
      .post('/api/scoreboard')
      .send({user: 1, problem: 2, time: 21, status: 'C'})
      .end(function(err, res) {
        expect(res.status).to.be.equal(200);

        expect(res.body.queue.user).to.be.equal(1);
        expect(res.body.queue.problem).to.be.equal(2);
        expect(res.body.queue.time).to.be.equal(21);
        expect(res.body.queue.status).to.be.equal("C");

        expect(res.body.score.user).to.be.equal(1);
        expect(res.body.score.problems).to.be.equal(1);
        expect(res.body.score.penalty).to.be.equal(41);
        done();
      });
  });

  it('POST /api/scoreboard queue 5', function(done) {
    chai.request(app)
      .post('/api/scoreboard')
      .send({user: 1, problem: 1, time: 25, status: 'C'})
      .end(function(err, res) {
        expect(res.status).to.be.equal(200);

        expect(res.body.queue.user).to.be.equal(1);
        expect(res.body.queue.problem).to.be.equal(1);
        expect(res.body.queue.time).to.be.equal(25);
        expect(res.body.queue.status).to.be.equal("C");

        expect(res.body.score.user).to.be.equal(1);
        expect(res.body.score.problems).to.be.equal(2);
        expect(res.body.score.penalty).to.be.equal(66);
        done();
      });
  });

  it('POST /api/scoreboard contestants between 1-100', function(done) {
    chai.request(app)
      .post('/api/scoreboard')
      .send({user: 1000, problem: 1, time: 10, status: 'C'})
      .end(function(err, res) {
        expect(res.status).to.be.equal(500);
        expect(res.body.message).to.be.equal('Contestants must be 1-100.');
        done();
      });
  });
  it('POST /api/scoreboard problemas between 1-9', function(done) {
    chai.request(app)
      .post('/api/scoreboard')
      .send({user: 2, problem: 10, time: 10, status: 'C'})
      .end(function(err, res) {
        expect(res.status).to.be.equal(500);
        expect(res.body.message).to.be.equal('Problems must be 1-9.');
        done();
      });
  });

  it('GET /api/scoreboard', function(done) {
    chai.request(app)
      .get('/api/scoreboard')
      .end(function(err, res) {
        expect(res.body.scores.length).to.be.equal(2);
        done();
      });
  });

  it('POST /api/gist', function(done) {
    this.timeout(3000);
    chai.request(app)
      .post('/api/gist')
      .send({
        "description": "Hello World Examples",
        "public": true,
        "files": {
          "hello_world.rb": {
            "content": "class HelloWorld\n   def initialize(name)\n      @name = name.capitalize\n   end\n   def sayHi\n      puts \"Hello !\"\n   end\nend\n\nhello = HelloWorld.new(\"World\")\nhello.sayHi"
          }
        }
      })
      .end(function(err, res) {
        gistId = res;
        done();
      });
  });

  it('POST /api/gist/:id/comments', function(done) {
    chai.request(app)
      .get('/api/gist/123/comments')
      .end(function(err, res) {
        done();
      });
  });
});
