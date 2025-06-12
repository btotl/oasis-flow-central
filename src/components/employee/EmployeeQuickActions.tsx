
import { Gift, Package, Users, Receipt, Leaf } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { PlantLookupModal } from '../PlantLookupModal';
import { useNavigate } from 'react-router-dom';

interface EmployeeQuickActionsProps {
  onOpenModal: (modalType: string) => void;
}

export const EmployeeQuickActions = ({ onOpenModal }: EmployeeQuickActionsProps) => {
  const navigate = useNavigate();
  const [showPlantLookup, setShowPlantLookup] = useState(false);

  const handleNavigateToReceipt = () => {
    navigate('/receipt-maker');
  };

  const handleOpenPlantLookup = () => {
    setShowPlantLookup(true);
  };

  return (
    <>
      <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-purple/20 to-neo-yellow/20">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => onOpenModal('voucher')}
            className="neo-button-primary w-full flex items-center justify-center gap-2 p-3"
          >
            <Gift size={20} />
            Add Gift Voucher
          </button>
          <button
            onClick={() => onOpenModal('layby')}
            className="neo-button w-full flex items-center justify-center gap-2 p-3"
          >
            <Package size={20} />
            Add Layby
          </button>
          <button
            onClick={() => onOpenModal('request')}
            className="neo-button w-full flex items-center justify-center gap-2 p-3"
          >
            <Users size={20} />
            Customer Request
          </button>
          <button
            onClick={handleNavigateToReceipt}
            className="neo-button bg-neo-green text-white w-full flex items-center justify-center gap-2 p-3"
          >
            <Receipt size={20} />
            Receipt Maker
          </button>
          <button
            onClick={handleOpenPlantLookup}
            className="neo-button bg-neo-blue text-white w-full flex items-center justify-center gap-2 p-3"
          >
            <Leaf size={20} />
            Plant Lookup
          </button>
        </div>
      </div>

      <PlantLookupModal
        isOpen={showPlantLookup}
        onClose={() => setShowPlantLookup(false)}
      />
    </>
  );
};
