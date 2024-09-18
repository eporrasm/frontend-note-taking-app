import React, { useState, useEffect } from 'react';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import { BACKEND_URL } from './config'; // Import the centralized URL

// Define a type for the note object
type Note = {
  id: number;
  body: string;
};

const NoteApp = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteBody, setNoteBody] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editNoteId, setEditNoteId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/notes`);
      const data: Note[] = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const createNote = async () => {
    const response = await fetch(`${BACKEND_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: noteBody }),
    });
    const newNote: Note = await response.json();
    setNotes([...notes, newNote]);
    setNoteBody('');
  };

  const updateNote = async (id: number) => {
    const response = await fetch(`${BACKEND_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: noteBody }),
    });
    const updatedNote: Note = await response.json();
    setNotes(notes.map(note => (note.id === id ? updatedNote : note)));
    setNoteBody('');
    setEditMode(false);
    setEditNoteId(null);
  };

  const deleteNote = async (id: number) => {
    await fetch(`${BACKEND_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEdit = (note: Note) => {
    setEditMode(true);
    setEditNoteId(note.id);
    setNoteBody(note.body);
  };

  return (
    <div className="note-app">
      <NoteForm
        noteBody={noteBody}
        setNoteBody={setNoteBody}
        editMode={editMode}
        handleSubmit={editMode ? () => updateNote(editNoteId!) : createNote}
      />
      <NoteList
        notes={notes}
        handleEdit={handleEdit}
        deleteNote={deleteNote}
      />
    </div>
  );
};

export default NoteApp;