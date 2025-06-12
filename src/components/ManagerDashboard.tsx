
import { useState } from 'react';
import { ManagerHeader } from './manager/ManagerHeader';
import { AddTaskForm } from './manager/AddTaskForm';
import { ManagementTools } from './manager/ManagementTools';
import { EmployeeNotesManager } from './manager/EmployeeNotesManager';
import { ManagerNotes } from './manager/ManagerNotes';
import { Consignments } from './manager/Consignments';
import { ReceiptMaker } from './manager/ReceiptMaker';
import { PlantLookup } from './manager/PlantLookup';
import { CustomerLoyalty } from './manager/CustomerLoyalty';
import { IntegratedCalendar } from './manager/IntegratedCalendar';
import { CustomerRequestTracking } from './manager/CustomerRequestTracking';
import { CustomizableTemplates } from './manager/CustomizableTemplates';
import { ImportantMessage } from '@/types/ImportantMessage';
import { MessageManagementModal } from './MessageManagementModal';
import { PlantLookupModal } from './PlantLookupModal';
import { LayoutEditor } from './LayoutEditor';
import { Button } from './ui/button';
import { Receipt, Leaf, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ManagerDashboardProps {
  importantMessages: ImportantMessage[];
  setImportantMessages: (messages: ImportantMessage[]) => void;
}

export const ManagerDashboard = ({ importantMessages, setImportantMessages }: ManagerDashboardProps) => {
  const navigate = useNavigate();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPlantLookup, setShowPlantLookup] = useState(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);

  const handleNavigateToReceipt = () => {
    navigate('/receipt-maker');
  };

  const handleOpenPlantLookup = () => {
    setShowPlantLookup(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <ManagerHeader 
        importantMessages={importantMessages}
        onOpenMessageModal={() => setShowMessageModal(true)}
        onOpenLayoutEditor={() => setShowLayoutEditor(true)}
      />
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={handleNavigateToReceipt}
          className="neo-button bg-neo-green text-white"
        >
          <Receipt size={20} className="mr-2" />
          Receipt Maker
        </Button>
        <Button 
          onClick={handleOpenPlantLookup}
          className="neo-button bg-neo-blue text-white"
        >
          <Leaf size={20} className="mr-2" />
          Plant Lookup
        </Button>
        <Button 
          onClick={() => navigate('/settings')}
          className="neo-button bg-neo-purple text-white"
        >
          <Settings size={20} className="mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 xl:col-span-2 space-y-4 sm:space-y-6">
          <AddTaskForm />
          <CustomerRequestTracking />
          <IntegratedCalendar />
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <ManagementTools onOpenModal={() => {}} />
          <ManagerNotes />
          <EmployeeNotesManager />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Consignments />
        <CustomerLoyalty />
      </div>

      <CustomizableTemplates />

      {showMessageModal && (
        <MessageManagementModal
          onClose={() => setShowMessageModal(false)}
          importantMessages={importantMessages}
          setImportantMessages={setImportantMessages}
        />
      )}

      <PlantLookupModal
        isOpen={showPlantLookup}
        onClose={() => setShowPlantLookup(false)}
      />

      {showLayoutEditor && (
        <LayoutEditor
          onClose={() => setShowLayoutEditor(false)}
          dashboardType="manager"
        />
      )}
    </div>
  );
};
