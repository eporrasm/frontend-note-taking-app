import React, { useState, useEffect } from 'react';

type NoteFormProps = {
  noteBody: string;
  setNoteBody: (body: string) => void;
  editMode: boolean;
  handleSubmit: () => void;
  categories: { id: number; name: string }[];
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  newCategory: string;
  setNewCategory: (name: string) => void;
};

const NoteForm: React.FC<NoteFormProps> = ({
  noteBody,
  setNoteBody,
  editMode,
  handleSubmit,
  categories,
  selectedCategory,
  setSelectedCategory,
  newCategory,
  setNewCategory,
}) => {
  const [charCount, setCharCount] = useState(noteBody.length);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteBody(text);
    setCharCount(text.length);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedCategory(categoryId);
    setNewCategory('');
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
    setSelectedCategory(null);
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
        <div className="category-inputs">
          <select value={selectedCategory || ''} onChange={handleCategoryChange} disabled={!!newCategory}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <span className="or-text">OR</span>
          <input
            type="text"
            value={newCategory}
            onChange={handleNewCategoryChange}
            placeholder="New Category"
            disabled={!!selectedCategory}
          />
        </div>
        <button type="submit">{editMode ? 'Update Note' : 'Create Note'}</button>
      </form>
    </div>
  );
};

export default NoteForm;