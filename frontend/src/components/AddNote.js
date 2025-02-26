//Provides a form for users to enter a new title and content and submit it
/**
 * When to use useState
 * -The data changes based on user input
 * -The UI should update when the data changes
 * -The value should persist between re-renders
 */
import React, { useState } from 'react';

function AddNote ({addNote}) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        //Prevent the default behavior of the submit button
        e.preventDefault(); 

        //If the input is empty or only whitespace, do nothing
        if (!title.trim()) return; //.trim() removes spaces from the begining and end
        if (!content.trim()) return;

        //Wait for parent to send data to the api
        await addNote(title, content);

        //Reset the input fields
        setTitle('');
        setContent('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type='text'
                placeholder='Input Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder='Input Content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <button type='submit'>Add</button>
        </form>
    );
}

export default AddNote;