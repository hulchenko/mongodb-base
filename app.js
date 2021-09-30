//imports
const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const path = require('path');
const collection = 'users';
const port = 3000;

// HTML page to render on the endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// fetch existing data
app.get('/users', (req, res) => {
  // receive json data
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, users) => {
      if (err) console.log(`ERROR RECEIVING DATA: `, err);
      else {
        //on Success render users data
        res.status(200).json(users);
      }
    });
});

// create new data
app.post('/', (req, res, next) => {
  // Document to be inserted
  const newUser = req.body;
  db.getDB()
    .collection(collection)
    .insertOne(newUser, (err, result) => {
      if (err) {
        console.log(`ERROR CREATING NEW USER`, err);
      } else {
        console.log(result);
        res.json({
          result: result,
        });
      }
    });
});

db.connect((error) => {
  if (error) {
    console.log(`ERROR CONNECTING`, error);
  } else {
    app.listen(port, () => {
      console.log(`SUCCESSFULLY CONNECTED TO PORT ${port}`);
    });
  }
});
