
interface EmployeeQuickActionsProps {
  onOpenModal: (modalType: string) => void;
}

export const EmployeeQuickActions = ({ onOpenModal }: EmployeeQuickActionsProps) => {
  return (
    <div className="neo-card p-4 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Quick Actions</h3>
      <div className="space-y-3">
        <button
          onClick={() => onOpenModal('voucher')}
          className="neo-button bg-neo-pink text-white w-full text-sm sm:text-base"
        >
          Gift Vouchers
        </button>
        <button
          onClick={() => onOpenModal('layby')}
          className="neo-button bg-neo-blue text-white w-full text-sm sm:text-base"
        >
          Layby Tracker
        </button>
        <button
          onClick={() => onOpenModal('request')}
          className="neo-button bg-neo-green text-white w-full text-sm sm:text-base"
        >
          Customer Requests
        </button>
      </div>
    </div>
  );
};
