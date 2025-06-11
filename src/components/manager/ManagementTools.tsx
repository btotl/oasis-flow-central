
import { CreditCard } from 'lucide-react';

interface ManagementToolsProps {
  onOpenModal: (modalType: string) => void;
}

export const ManagementTools = ({ onOpenModal }: ManagementToolsProps) => {
  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-blue/20 to-neo-green/20">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Management Tools</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <button
          onClick={() => onOpenModal('voucher')}
          className="neo-button bg-neo-pink text-white h-12 sm:h-16 text-sm sm:text-base"
        >
          Gift Vouchers
        </button>
        
        <button
          onClick={() => onOpenModal('layby')}
          className="neo-button bg-neo-blue text-white h-12 sm:h-16 text-sm sm:text-base"
        >
          Laybys
        </button>
        
        <button
          onClick={() => onOpenModal('request')}
          className="neo-button bg-neo-green text-white h-12 sm:h-16 text-sm sm:text-base"
        >
          Customer Requests
        </button>
        
        <button
          onClick={() => onOpenModal('credit')}
          className="neo-button bg-neo-yellow text-white h-12 sm:h-16 text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <CreditCard size={16} />
          Customer Credit
        </button>
        
        <button
          onClick={() => onOpenModal('messages')}
          className="neo-button bg-neo-orange text-white h-12 sm:h-16 text-sm sm:text-base"
        >
          Important Messages
        </button>
      </div>
    </div>
  );
};
