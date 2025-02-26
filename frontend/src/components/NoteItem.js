//Receives key, note, deleteNote, and editNote and displays a single note's title and content and provides a button to delete it and a button to edit it
import React, {useState} from 'react'; //Need useState because content is going to be updated dynamically whenever the user clicks the edit button

function NoteItem ({note, deleteNote, editNote}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(note.title);
    const [editedContent, setEditedContent] = useState(note.content);

    const handleEdit = async () => {
        //Call the editNote function with the new data
        await editNote(note._id, {title: editedTitle, content: editedContent});
        setIsEditing(false);
    };

    return (
        <li>
            {isEditing ? (
                //When editing show an input and text element field with the current data
                <>{/* Wrap multiple elements inside a parent <> </> because ternary operator ? : returns multiple elements inside each conditional block */}
                    <input 
                        type='text'
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <textarea
                        value={editedContent}
                        onChange = {(e) => setEditedContent(e.target.value)}
                    >
                    </textarea>
                </>
            ) : (
                //When not editing display title and content
                <>
                    <span>{note.title}</span>
                    <div>{note.content}</div>
                </>
            )}

            {/* Toggle edit mode or save changes */}
            {isEditing ? (
                <button onClick={handleEdit}>Save</button>
            ) : (
                <button onClick={() => setIsEditing(true)}>Edit</button>
            )}

            {/* Delete button always remains available while the note item exists */}
            <button onClick={() => deleteNote(note._id)}>Delete</button>
        </li>
    );
}

export default NoteItem;