const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = 'user_database';
const url = 'mongodb://localhost:27017';
const mongoOptions = { useNewUrlParser: true };

const state = {
  db: null,
};

const connect = (callback) => {
  if (state.db) {
    callback();
  } else {
    MongoClient.connect(url, mongoOptions, (error, client) => {
      if (error) {
        callback(error);
      } else {
        state.db = client.db(dbname);
        callback();
      }
    });
  }
};

const getPrimaryKey = (_id) => {
  return ObjectID(_id);
};

const getDB = () => {
  return state.db;
};

module.exports = { connect, getPrimaryKey, getDB };
