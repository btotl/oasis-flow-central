
import { useState } from 'react';
import { MessageSquare, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImportantMessage } from '@/types/ImportantMessage';

export interface ManagerHeaderProps {
  importantMessages?: ImportantMessage[];
  onOpenMessageModal: () => void;
  onOpenLayoutEditor?: () => void;
}

export const ManagerHeader = ({ importantMessages = [], onOpenMessageModal, onOpenLayoutEditor }: ManagerHeaderProps) => {
  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-purple/20 to-neo-blue/20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Manager Dashboard</h1>
        <div className="flex gap-2">
          {onOpenLayoutEditor && (
            <Button 
              onClick={onOpenLayoutEditor}
              className="neo-button bg-neo-blue text-white"
            >
              <Edit size={20} className="mr-2" />
              Edit Layout
            </Button>
          )}
          <Button 
            onClick={onOpenMessageModal}
            className="neo-button bg-neo-orange text-white"
          >
            <MessageSquare size={20} className="mr-2" />
            Manage Messages ({importantMessages.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
