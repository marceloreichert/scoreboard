"use strict";

var db = require('../models/db.js');

async function processInput(params, res) {
  const result = await addQueue(params);
  res.status(result.status).json(result.message);
}

async function getScores(res) {
  const scores = await db.findAll('score', {problems: -1, penalty: 1});
  res.status(200).json({scores: scores});
}

async function verifyInput(params) {
  const result = {
    status: true,
    message: 'OK'
  }

  if (params.user < 1 || params.user > 100) {
    result.status = false;
    result.message = 'Contestants must be 1-100.';
  }

  else if (params.problem < 1 || params.problem > 9) {
    result.status = false;
    result.message = 'Problems must be 1-9.';
  }

  return result;
}

async function addQueue(params) {
  let result = {
    status: 500,
    message: null
  }
  let queue = await db.insert('queue', params);

  if (!queue) {
    result.message = 'Error. Insert queue.';
    return result;
  } else {
    if (params.status == "C" || params.status == "I") {
      const score = await addScore(params);
      if (!score) {
        result.message = 'Error. Insert score.';
        return result;
      } else {
        result.status = 200;
        result.message = {queue: queue, score: score};
        return result;
      }
    } else {
      result.status = 200;
      result.message = {queue: queue, score: null};
      return result;
    }
  }
}

async function addScore(params) {
  let score = await db.findOne('score', {user: params.user});

  if (!score) {
    let penalty = params.time;
    let problemsResolved = 0;

    if (params.status == "I") { penalty = 20;}
    if (params.status == "C") { problemsResolved = 1;}

    return await db.insert('score', {user: params.user, problems: problemsResolved, penalty: penalty});
  }
  else {
    score = await db.findOne('score', {user: params.user});
    if (score) {
      if (params.status == "I") {
        score.penalty = score.penalty + 20;
      }
      if (params.status == "C") {
        score.problems = score.problems + 1;
        score.penalty = score.penalty + params.time;
      }
      const document = await db.updateOne('score', score);
      return document.value;
    }
  }
}

module.exports = {
  processInput: processInput,
  verifyInput: verifyInput,
  getScores: getScores
}
