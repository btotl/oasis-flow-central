
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface EmployeeNote {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
}

export const EmployeeNotesManager = () => {
  const [employeeNotes] = useState<EmployeeNote[]>([
    {
      id: '1',
      content: 'Customer asked about rare orchid varieties - might need special order',
      timestamp: new Date(2024, 5, 9, 14, 30),
      author: 'Sarah'
    }
  ]);

  const deleteNote = (noteId: string) => {
    console.log('Deleting note:', noteId);
    // In a real app, this would update the notes state
  };

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-purple/20 to-neo-blue/20">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Employee Notes</h2>
      
      <div className="space-y-3 max-h-80 overflow-y-auto neo-scrollbar">
        {employeeNotes.map((note) => (
          <div key={note.id} className="bg-neo-yellow/30 border-4 border-black p-4 rounded-xl relative">
            <p className="text-gray-900 font-medium text-sm sm:text-base break-words pr-8">{note.content}</p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 text-xs sm:text-sm text-gray-600">
              <span>By: {note.author}</span>
              <span className="mt-1 sm:mt-0">{note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString()}</span>
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
