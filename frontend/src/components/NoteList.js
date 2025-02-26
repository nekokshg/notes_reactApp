//Receives notes, editNote, and deleteNote and maps over the notes to render each individual NoteItem
import React from 'react';
import NoteItem from './NoteItem';

function NoteList({ notes, editNote, deleteNote }) {
    return (
        <ul id='noteList'>
            { //{} means execute JS inside JSX
                notes.map(note => ( //() inside {} means return to JSX again
                    <NoteItem key={note._id} note={note} deleteNote={deleteNote} editNote={editNote} />
            ))}
        </ul>
    )
}

export default NoteList;