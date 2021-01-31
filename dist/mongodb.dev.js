"use strict";

// CRUD create read update delete
var _require = require('mongodb'),
    MongoClient = _require.MongoClient,
    ObjectID = _require.ObjectID,
    DBRef = _require.DBRef;

var connectionURL = 'mongodb://127.0.0.1:27017';
var databaseName = 'task-manager';
MongoClient.connect(connectionURL, {
  useNewUrlParser: true
}, function (error, client) {
  if (error) {
    return console.log('Unable to connect to database');
  }

  var db = client.db(databaseName); // db.collection('users').deleteMany({
  //     age:27
  // }).then((result) => {
  //     console.log(result);
  // }).catch((error) => {
  //     console.log(error);
  // })

  db.collection('tasks').deleteOne({
    description: 'Clean the floor'
  }).then(function (result) {
    console.log(result);
  })["catch"](function (error) {
    console.log(error);
  });
});