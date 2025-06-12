
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ManagerNote {
  id: string;
  title: string;
  content: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export const ManagerNotes = () => {
  const { user, profile } = useAuth();
  const [notes, setNotes] = useState<ManagerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<ManagerNote | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

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
        .order('created_at', { ascending: false });

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
    if (!user || !profile) return;

    try {
      if (editingNote) {
        const { error } = await supabase
          .from('manager_notes')
          .update({
            title: formData.title,
            content: formData.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNote.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('manager_notes')
          .insert({
            title: formData.title,
            content: formData.content,
            created_by: user.id,
            created_by_name: profile.first_name
          });

        if (error) throw error;
      }

      setFormData({ title: '', content: '' });
      setShowAddModal(false);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
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

  const handleEdit = (note: ManagerNote) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setEditingNote(null);
    setShowAddModal(false);
  };

  if (profile?.role !== 'manager') return null;

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-purple/20 to-neo-blue/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Manager Notes</h3>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="neo-button bg-neo-green text-white">
              <Plus size={16} className="mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="neo-button bg-neo-blue text-white">
                  {editingNote ? 'Update' : 'Create'}
                </Button>
                <Button type="button" onClick={resetForm} className="neo-button">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto neo-scrollbar">
        {loading ? (
          <div className="text-center py-4">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No manager notes yet</div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-neo-yellow/30 border-4 border-black p-4 rounded-xl relative">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900">{note.title}</h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1 bg-blue-500 text-white rounded-lg border-2 border-black hover:bg-blue-600"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mb-2 whitespace-pre-wrap">{note.content}</p>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-gray-600">
                <span>By: {note.created_by_name}</span>
                <span className="flex items-center gap-1 mt-1 sm:mt-0">
                  <Calendar size={12} />
                  {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
