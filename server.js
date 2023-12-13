const fs = require('fs');
const path = require('path');
const express = require('express');
const { v4: uuidv4 } = require('uuid'); 
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db/db.json');

app.use(express.static('public'));
app.use(express.json());

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        let dbData = JSON.parse(data);
        res.json(dbData);
    });   
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); // Assign a unique ID to the new note
    db.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(db));
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const newDb = db.filter((note) => note.id !== noteId);
    fs.writeFileSync('./db/db.json', JSON.stringify(newDb));
    res.json(newDb);
});

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`App listening on ${PORT}`));
