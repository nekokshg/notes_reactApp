//Server side file (API): Responsible for handling the data sent from the frontend and sending it to the backend (MongoDB)

//Initialization
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

//Middleware
app.use(express.json());
app.use(cors());

//MongoDB setup
//Connect to DB
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Unable to connect to MongoDB', error);
        process.exit(1); //Stop server if unable to connect
    }
}
connectToDB();

//Set up the schema
/**
 * Example:
 * {
 *  title: 'What I did today',
 *  content: 'I went out to eat and then I read a book...'
 * }
 */
const notesSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
}, {timestamps: true}); //Adds createdAt and updatedAt timestamps

//Turn the schema into a model
const Note = mongoose.model('Note', notesSchema);

//CRUD API ROUTES => CREATE, READ, UPDATE, DELETE
//Get all notes
app.get('/api/notes', async (req,res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({error: 'Unable to retrive all the notes'});
    }
});

//Get a note
app.get('/api/notes/:id', async (req,res) => {
    try {
        //Get the id from the param
        const { id } = req.params;

        //Find the note in mongoDB
        const note = await Note.findById(id);

        //If note not found return error
        if (!note) return res.status(404).json({error: 'Note note found, invalid id'});

        //Return status 200 (ok) and return the note to the front end
        res.status(200).json(note);

    } catch (error) {
        res.status(500).json({error: 'Unable to retrieve note'});
    }
});

//Add a new note
app.post('/api/notes', async (req,res) => {
    try {
        //Get title and content from frontend
        const { title, content } = req.body;

        //If title or content missing thrown an error
        if (!title || !content) return res.status(400).json({error: 'Missing title and content'}); //400 (bad request) missing data from the frontend is a client error

        //Create a new mongoose document based on the Note model
        const newNote = new Note({
            title, content
        });

        //Save the newNote in MongoDB
        const savedNote = await newNote.save();

        //Return status 201 (created) and return the savedNote
        res.status(201).json(savedNote);

    } catch (error) {
        res.status(500).json({error: 'Unable to create note'});
    }
});

//Replace a previous note with a edited one
app.put('/api/notes/:id', async (req,res) => {
    try {
        //Get the id from the params
        const { id } = req.params;

        //Get the edited title/content from the frontend
        const { title: newTitle, content: newContent } = req.body;

        //Error check if the title or content is missing from the frontend
        if (!newTitle || !newContent) return res.status(400).json({error: 'Title or content missing'});

        //Update the note in MongoDB
        const editedNote = await Note.findByIdAndUpdate(
            id, 
            {title: newTitle,
            content: newContent},
            {new: true} //Return the updated note
        );

        //Return status 200 (ok) and the edited note
        res.status(200).json(editedNote);

    } catch (error) {
        res.status(500).json({error: 'Unable to replace note with edited note'});
    }
});

//Delete a note
app.delete('/api/notes/:id', async (req,res) => {
    try {
        //Get the id from the params
        const { id } = req.params;

        //Find and delete the note in the DB
        await Note.findByIdAndDelete(id);

        //Return status 200 (ok) and JSON message verifying deletion
        res.status(200).json({message: 'Note successfully deleted'});
    } catch (error) {
        res.status(500).json({error: 'Unable to delete note'});
    }
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
