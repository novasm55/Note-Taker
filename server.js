// Import the required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Initialize the Express app
const app = express();

// Set the port for the server to listen on, either from the environment variable or default to 3001
const PORT = process.env.PORT || 3001;

// Set up Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, JavaScript, etc.) from the 'public' directory
app.use(express.static('public'));

// HTML routes

// Route to serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});


// API routes

// Read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'));
  res.json(notes);
});

// Receive a new note, add it to the db.json file, and return the new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Generate a unique ID for the new note

  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'));
  notes.push(newNote);

  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(notes));

  res.json(newNote);
});

// Optional: DELETE route to delete a note with a given ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'));
  const updatedNotes = notes.filter(note => note.id !== noteId);

  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(updatedNotes));

  res.json({ message: `Note with ID ${noteId} has been deleted` });
});

// Route to serve the index.html file (catch-all route)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

  
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
