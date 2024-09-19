import React, { useState, useEffect } from 'react';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import { BACKEND_URL } from './config';

type Note = {
  id: number;
  body: string;
  archived: boolean;
  category: {
    id: number;
    name: string;
  } | null;
};

type Category = {
  id: number;
  name: string;
};

const NoteApp = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteBody, setNoteBody] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editNoteId, setEditNoteId] = useState<number | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, [showArchived]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/notes?archived=${showArchived}`);
      const data: Note[] = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/categories`);
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createCategory = async (name: string): Promise<Category> => {
    const existingCategory = categories.find(category => category.name.toLowerCase() === name.toLowerCase());
    if (existingCategory) {
      return existingCategory;
    }
    const response = await fetch(`${BACKEND_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    const newCategory: Category = await response.json();
    return newCategory;
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
    let category: Category | null = null;
    if (newCategory) {
      category = await createCategory(newCategory);
      await updateNoteCategory(newNote.id, category.id);
    } else if (selectedCategory) {
      category = categories.find(cat => cat.id === selectedCategory) || null;
      await updateNoteCategory(newNote.id, selectedCategory);
    }
    setNotes([...notes, { ...newNote, category }]);
    setNoteBody('');
    setNewCategory('');
    fetchCategories();
  };

  const updateNote = async (id: number) => {
    let categoryId = selectedCategory;
    let category: Category | null = null;
    if (newCategory) {
      category = await createCategory(newCategory);
      categoryId = category.id;
    } else if (selectedCategory) {
      category = categories.find(cat => cat.id === selectedCategory) || null;
    }
    const response = await fetch(`${BACKEND_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: noteBody, categoryId }),
    });
    const updatedNote: Note = await response.json();
    setNotes(notes.map(note => (note.id === id ? { ...updatedNote, category } : note)));
    setNoteBody('');
    setEditMode(false);
    setEditNoteId(null);
    setNewCategory('');
    fetchCategories();
  };

  const updateNoteCategory = async (noteId: number, categoryId: number) => {
    await fetch(`${BACKEND_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryId }),
    });
  };

  const deleteNote = async (id: number) => {
    await fetch(`${BACKEND_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleArchive = async (note: Note) => {
    const categoryId = note.category ? note.category.id : null;
    const response = await fetch(`${BACKEND_URL}/notes/${note.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ archived: !note.archived, categoryId }),
    });
    const updatedNote: Note = await response.json();
    setNotes(notes.filter(n => n.id !== note.id));
  };

  const handleEdit = (note: Note) => {
    setEditMode(true);
    setEditNoteId(note.id);
    setNoteBody(note.body);
    setSelectedCategory(note.category ? note.category.id : null);
    setNewCategory('');
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const filteredNotes = filterCategory
    ? notes.filter(note => note.category && note.category.id === filterCategory)
    : notes;

  return (
    <div className="note-app">
      <NoteForm
        noteBody={noteBody}
        setNoteBody={setNoteBody}
        editMode={editMode}
        handleSubmit={editMode ? () => updateNote(editNoteId!) : createNote}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
      />
      <div className="view-toggle">
        <button
          className={showArchived ? '' : 'active'}
          onClick={() => setShowArchived(false)}
        >
          Notes
        </button>
        <button
          className={showArchived ? 'active' : ''}
          onClick={() => setShowArchived(true)}
        >
          Archive
        </button>
      </div>
      <div className="filter-category">
        <select value={filterCategory || ''} onChange={(e) => setFilterCategory(e.target.value ? parseInt(e.target.value) : null)}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <NoteList
        notes={filteredNotes}
        handleEdit={handleEdit}
        deleteNote={deleteNote}
        toggleArchive={toggleArchive}
      />
    </div>
  );
};

export default NoteApp;