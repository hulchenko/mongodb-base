//imports
const express = require('express');
const mongodb = require('./mongodb');
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
//make sure mongoDB is installed locally

// HTML page to render on the endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// fetch existing data
app.get('/getUsers', (req, res) => {
  // receive json data
  mongodb
    .getDB()
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

// update
app.put('/:id', (req, res) => {
  // Primary Key of user to update
  const userID = req.params.id;
  // string used to update
  const userInput = req.body;
  mongodb
    .getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: mongodb.getPrimaryKey(userID) },
      { $set: { user: userInput.user } },
      { returnOriginal: false },
      (err, result) => {
        if (err) console.log(err);
        else {
          res.json(result);
        }
      }
    );
});

mongodb.connect((error) => {
  if (error) {
    console.log(`ERROR CONNECTING`, error);
  } else {
    app.listen(port, () => {
      console.log(`SUCCESSFULLY CONNECTED TO PORT ${port}`);
    });
  }
});
