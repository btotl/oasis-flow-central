
import { useState } from 'react';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
}

export const EmployeeNotes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Customer asked about rare orchid varieties - might need special order',
      timestamp: new Date(2024, 5, 9, 14, 30),
      author: 'Sarah'
    }
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        timestamp: new Date(),
        author: 'Current Employee'
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  return (
    <div className="neo-card p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">📝 Notes for Manager</h2>
      
      {/* Add new note */}
      <div className="mb-6">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Leave a note for the manager..."
          className="neo-input w-full h-24 resize-none"
        />
        <button
          onClick={addNote}
          className="neo-button bg-neo-orange text-white mt-3"
        >
          Add Note
        </button>
      </div>

      {/* Notes list */}
      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-neo-yellow/30 border-4 border-black p-4">
            <p className="text-gray-900 font-medium">{note.content}</p>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
              <span>By: {note.author}</span>
              <span>{note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
