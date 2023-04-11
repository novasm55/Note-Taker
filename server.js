// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Get routes

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});


//API notes
// GET request for notes

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.json(JSON.parse(data));

    console.log('${req.method} notes get request')
  });
});

// Post request for notes
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.json(newNote);
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
