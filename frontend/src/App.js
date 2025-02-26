//Main component: responsible for state management, API interactions and passing props (passing data/functions to child components)
import React, { useState, useEffect } from 'react';
import AddNote from './components/AddNote';
import NoteList from './components/NoteList';

function App() {

  //Initialize array notes to hold the states (i.e. data of each note object) of the notes
  const [notes, setNotes] = useState([]);

  //Fetch all the initial notes from the backend when the page loads
  useEffect(() => {
    //Async function to get all the notes from the backend
    async function getNotes() {
      try {
        //Send a GET request to the backend
        const response = await fetch('/api/notes');

        //Convert from JSON
        const notes = await response.json();

        //Store states
        setNotes(notes);
      } catch (error) {
        console.error('Unable to get all the initial notes', error);
      }
    }
    getNotes();
  }, []); //Run this only once

  //Function to get a note based on a specific id
  const getNote = async (id) => {
    try {
      //Send a GET request to the backend
      const response = await fetch(`/api/notes/${id}`);

      //Convert from JSON
      const note = await response.json();

      return note
    } catch (error) {
      console.error('Unable to get note', error);
    }
  };

  //Function to add a new note to the backend
  const addNote = async (title, content) => {
    try{
      //Send a POST request to the backend
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, content})
      });

      //Convert JSON
      const newNote = await response.json();

      //Update the notes state by adding new note
      setNotes([...notes, newNote]); //Creates a brand new array with the current notes and appends the new note at the end

    } catch (error) {
      console.error('Unable to add note', error);
    }
  };

  //Function to edit a note
  const editNote = async(id, updatedData) => {
    try {
      //Send a PUT request to the backend
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedData)
      });

      //Convert from JSON
      const editedNote = await response.json();

      //Update the notes by replacing the old note with the new note
      setNotes(notes.map(note => (note._id === id ? editedNote : note))); //Creates a new array where any note that matches the id is replaced

    } catch (error) {
      console.error('Unable to edit note', error);
    }
  };

  //Function to delete a note
  const deleteNote = async(id) => {
    try {
      //Send a DELETE request to the backend
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      });

      //Update the notes by filtering out the deleted todo
      setNotes(notes.filter(note => (note._id !== id))); //Creates new notes array where any note that does not match the id is kept

    } catch (error) {
      console.error('Unable to delete note', error);
    }
  };

  return (
    <div id='App'>
      <h1 id='appTitle'>Notes App</h1>
      {/* Display the AddNote component and pass the addNote function as a prop 
          -AddNote component is the form element
          -passing addNote function will allow the child component (AddNote) to send data to the parent component (App)
          Note: propName={actual function or actual data} 
      */}
      <AddNote addNote={addNote} /> 
      {/* Display the NoteList component and pass the notes array, editNote function,  and deleteNote function as a prop
          -NoteList will contain NoteItems
      */}
      <NoteList notes={notes} editNote={editNote} deleteNote={deleteNote} />
    </div>
  )
}

export default App;