const fs = require('fs');
const uuidv4 = require('../helpers/uuid')
const router = require('express').Router();

//Get Route to read notes from DB
router.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return
    }
    res.json(JSON.parse(data));
  });
});


// Post Route to push newNotes to DB
router.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return
    }
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return
      }
      res.json(newNote);
    });
  });
});

module.exports = router;
