
import { Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmployeeHeaderProps {
  onOpenLayoutEditor: () => void;
}

export const EmployeeHeader = ({ onOpenLayoutEditor }: EmployeeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="neo-card p-4 sm:p-6 mb-4 sm:mb-6 rounded-3xl bg-gradient-to-r from-neo-green/20 to-neo-yellow/20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Employee Dashboard</h2>
        <div className="flex gap-2">
          <Button 
            onClick={onOpenLayoutEditor}
            className="neo-button bg-neo-blue text-white"
          >
            <Edit size={20} className="mr-2" />
            Edit Layout
          </Button>
          <Button 
            onClick={() => navigate('/settings')}
            className="neo-button bg-neo-purple text-white"
          >
            <Settings size={20} className="mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
