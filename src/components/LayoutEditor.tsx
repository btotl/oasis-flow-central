
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Eye, EyeOff, X, Save } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutComponent {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

interface LayoutEditorProps {
  onClose: () => void;
  dashboardType: 'employee' | 'manager';
}

export const LayoutEditor = ({ onClose, dashboardType }: LayoutEditorProps) => {
  const { user } = useAuth();
  const [components, setComponents] = useState<LayoutComponent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLayout();
  }, [dashboardType]);

  const getDefaultComponents = () => {
    if (dashboardType === 'employee') {
      return [
        { id: 'tasks', name: 'To-Do List', visible: true, order: 0 },
        { id: 'time-tracking', name: 'Time Tracker', visible: true, order: 1 },
        { id: 'notes', name: 'Employee Notes', visible: true, order: 2 },
        { id: 'urgent-items', name: 'Urgent Items', visible: true, order: 3 },
        { id: 'quick-actions', name: 'Quick Actions', visible: true, order: 4 },
      ];
    } else {
      return [
        { id: 'add-task', name: 'Add Task Form', visible: true, order: 0 },
        { id: 'management-tools', name: 'Management Tools', visible: true, order: 1 },
        { id: 'manager-notes', name: 'Manager Notes', visible: true, order: 2 },
        { id: 'employee-notes', name: 'Employee Notes Manager', visible: true, order: 3 },
        { id: 'customer-requests', name: 'Customer Request Tracking', visible: true, order: 4 },
        { id: 'calendar', name: 'Integrated Calendar', visible: true, order: 5 },
        { id: 'consignments', name: 'Consignments', visible: true, order: 6 },
        { id: 'customer-loyalty', name: 'Customer Loyalty', visible: true, order: 7 },
        { id: 'templates', name: 'Customizable Templates', visible: true, order: 8 },
      ];
    }
  };

  const loadLayout = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('layout_configurations')
        .select('layout_config')
        .eq('user_id', user.id)
        .eq('dashboard_type', dashboardType)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.layout_config) {
        setComponents(data.layout_config as LayoutComponent[]);
      } else {
        setComponents(getDefaultComponents());
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      setComponents(getDefaultComponents());
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setComponents(updatedItems);
  };

  const toggleVisibility = (id: string) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, visible: !comp.visible } : comp
    ));
  };

  const saveLayout = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await supabase
        .from('layout_configurations')
        .upsert(
          {
            user_id: user.id,
            dashboard_type: dashboardType,
            layout_config: components,
            role: dashboardType === 'manager' ? 'manager' : 'employee'
          },
          {
            onConflict: 'user_id,dashboard_type'
          }
        );

      onClose();
    } catch (error) {
      console.error('Error saving layout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 max-w-md w-full rounded-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Edit {dashboardType === 'employee' ? 'Employee' : 'Manager'} Layout
          </h2>
          <button
            onClick={onClose}
            className="neo-button text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-4">
            Drag components to reorder them. Click the eye icon to show/hide components.
          </p>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="layout">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {components.map((component, index) => (
                    <Draggable key={component.id} draggableId={component.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white border-4 border-black rounded-xl p-3 flex items-center gap-3 ${
                            !component.visible ? 'opacity-50' : ''
                          }`}
                        >
                          <div {...provided.dragHandleProps} className="cursor-grab">
                            <GripVertical size={20} className="text-gray-400" />
                          </div>
                          
                          <span className="flex-1 font-medium text-gray-900">
                            {component.name}
                          </span>
                          
                          <button
                            onClick={() => toggleVisibility(component.id)}
                            className={`p-2 rounded-lg border-2 border-black ${
                              component.visible 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {component.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={saveLayout}
            disabled={loading}
            className="neo-button-primary flex-1"
          >
            <Save size={16} className="mr-2" />
            {loading ? 'Saving...' : 'Save Layout'}
          </Button>
          <Button
            onClick={onClose}
            className="neo-button flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
