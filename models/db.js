'use strict';
const config = require('../config');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
let connection = null;

async function getConnection() {
  if (!connection) {
    const dbURL = await getDBUrl();
    connection = await MongoClient.connect(dbURL);
  }
  return connection;
}

async function getCollection(collectionName) {
  const connection = await getConnection();
  const collection = await connection.collection(collectionName);
  return collection;
};

const findOne = async function (collectionName, query) {
  const collection = await getCollection(collectionName);
  return await collection.findOne(query);
};

async function find(collectionName, query) {
  const collection = await getCollection(collectionName);
  const result = await collection.find(query).toArray();
  return result;
};

async function findAll( collectionName, sort) {
  const collection = await getCollection(collectionName);
  const result = await collection.aggregate([{ $sort : sort }]).toArray();
  return result;
}

const updateOne = async function (collectionName, objectToUpdate) {
  const collection = await getCollection(collectionName);
  return collection.findOneAndUpdate({ _id: objectToUpdate._id }, objectToUpdate, { returnOriginal: false });
};

const insert = async function (collectionName, object) {
  const collection = await getCollection(collectionName);
  const saved = await collection.insert(object);
  return saved['ops'][0];
}

function getDBUrl(){
  if (config.node_env === "production") {
    return config.database.url.production;
  } else {
    return config.database.url.test;
  }
}

module.exports = {
  connection: getConnection,
  collection: getCollection,
  findOne: findOne,
  find: find,
  findAll: findAll,
  updateOne: updateOne,
  insert: insert
};
