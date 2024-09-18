import React, { useState } from 'react';

type NoteFormProps = {
  noteBody: string;
  setNoteBody: (body: string) => void;
  editMode: boolean;
  handleSubmit: () => void;
};

const NoteForm: React.FC<NoteFormProps> = ({ noteBody, setNoteBody, editMode, handleSubmit }) => {
  const [charCount, setCharCount] = useState(noteBody.length);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteBody(text);
    setCharCount(text.length);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteBody.length > 255) {
      alert('Note cannot exceed 255 characters.');
      return;
    }
    handleSubmit();
  };

  return (
    <div className="note-form">
      <h2>{editMode ? 'Edit Note' : 'Create Note'}</h2>
      <form onSubmit={onSubmit}>
        <textarea
          value={noteBody}
          onChange={handleChange}
          placeholder="Write your note here..."
        />
        <div className="char-counter">{charCount}/255</div>
        <button type="submit">{editMode ? 'Update Note' : 'Create Note'}</button>
      </form>
    </div>
  );
};

export default NoteForm;