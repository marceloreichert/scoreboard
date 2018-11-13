'use strict';

const express = require('express');
const router = express.Router();
const scoreboard = require('../controllers/scoreboard.js');
const github = require('../controllers/github.js');

router.post('/scoreboard', async function(req, res) {
  const user = req.body.user;
  const problem = req.body.problem;
  const time = req.body.time;
  const status = req.body.status;

  const document = {
    user: user,
    problem: problem,
    time: time,
    status: status
  }

  const verify = await scoreboard.verifyInput(document);

  if (verify.status) {
    scoreboard.processInput(document, res);
  } else {
    res.status(500).json({message: verify.message});
  }
});

router.get('/scoreboard', async function(req,res) {
  scoreboard.getScores(res);
});

router.post('/gist', async function(req,res) {
  const result = await github.addGist(req.body);
  res.status(200);
});

router.get('/gist/:id/comments', async function(req,res) {
  const result = await github.listComments(req.params.id);
  res.status(200).json(result);
});

module.exports = router;
