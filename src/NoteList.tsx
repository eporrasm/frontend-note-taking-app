import React from 'react';

type Note = {
  id: number;
  body: string;
};

type NoteListProps = {
  notes: Note[];
  handleEdit: (note: Note) => void;
  deleteNote: (id: number) => void;
};

const NoteList: React.FC<NoteListProps> = ({ notes, handleEdit, deleteNote }) => {
  return (
    <div className="note-list">
      <h2>Notes</h2>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <div className="note-body">{note.body}</div>
            <div className="note-actions">
              <button className="edit" onClick={() => handleEdit(note)}>Edit</button>
              <button className="delete" onClick={() => deleteNote(note.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;