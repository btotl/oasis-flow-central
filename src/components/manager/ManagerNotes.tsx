
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ManagerNote {
  id: string;
  title: string;
  content: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export const ManagerNotes = () => {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<ManagerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (profile?.role === 'manager') {
      fetchNotes();
    }
  }, [profile]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('manager_notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching manager notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title.trim() || !noteForm.content.trim()) return;

    try {
      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from('manager_notes')
          .update({
            title: noteForm.title,
            content: noteForm.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNote);

        if (error) throw error;
      } else {
        // Create new note
        const { error } = await supabase
          .from('manager_notes')
          .insert({
            title: noteForm.title,
            content: noteForm.content,
            created_by: profile?.id || '',
            created_by_name: profile?.first_name || 'Manager'
          });

        if (error) throw error;
      }

      setNoteForm({ title: '', content: '' });
      setShowForm(false);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEdit = (note: ManagerNote) => {
    setNoteForm({
      title: note.title,
      content: note.content
    });
    setEditingNote(note.id);
    setShowForm(true);
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const { error } = await supabase
        .from('manager_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const cancelEdit = () => {
    setNoteForm({ title: '', content: '' });
    setShowForm(false);
    setEditingNote(null);
  };

  if (profile?.role !== 'manager') return null;

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-blue/20 to-neo-purple/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Manager Notes</h3>
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="neo-button bg-neo-blue text-white"
          >
            <Plus size={16} className="mr-2" />
            New Note
          </Button>
        )}
      </div>

      {/* Note Entry Form */}
      {showForm && (
        <div className="bg-white border-4 border-black p-4 rounded-xl mb-4">
          <h4 className="font-bold mb-4">
            {editingNote ? 'Edit Note' : 'Create New Note'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                placeholder="Enter note title"
                required
              />
            </div>
            <div>
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                placeholder="Enter note content"
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="neo-button bg-neo-green text-white"
              >
                <Save size={16} className="mr-2" />
                {editingNote ? 'Update Note' : 'Save Note'}
              </Button>
              <Button 
                type="button"
                onClick={cancelEdit}
                className="neo-button bg-gray-500 text-white"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3 max-h-80 overflow-y-auto neo-scrollbar">
        {loading ? (
          <div className="text-center py-4">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No manager notes yet</div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white border-4 border-black p-4 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">{note.title}</h4>
                <div className="flex gap-1">
                  <Button
                    onClick={() => handleEdit(note)}
                    className="neo-button bg-neo-yellow text-black p-2"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(note.id)}
                    className="neo-button bg-red-500 text-white p-2"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">{note.content}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>By: {note.created_by_name}</span>
                <span>{new Date(note.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
