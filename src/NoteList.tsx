import React from 'react';

type Note = {
  id: number;
  body: string;
  archived: boolean;
  category: {
    id: number;
    name: string;
  } | null;
};

type NoteListProps = {
  notes: Note[];
  handleEdit: (note: Note) => void;
  deleteNote: (id: number) => void;
  toggleArchive: (note: Note) => void;
};

const NoteList: React.FC<NoteListProps> = ({ notes, handleEdit, deleteNote, toggleArchive }) => {
  return (
    <div className="note-list">
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <div className="note-body">{note.body}</div>
            {note.category && <div className="note-category">{note.category.name}</div>}
            <div className="note-actions">
              <button className="edit" onClick={() => handleEdit(note)}>Edit</button>
              <button className="delete" onClick={() => deleteNote(note.id)}>Delete</button>
              <button className="archive" onClick={() => toggleArchive(note)}>
                {note.archived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;