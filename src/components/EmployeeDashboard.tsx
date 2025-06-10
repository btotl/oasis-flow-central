
import { useState } from 'react';
import { TaskList } from './TaskList';
import { EmployeeNotes } from './EmployeeNotes';
import { UrgentItems } from './UrgentItems';
import { GiftVoucherModal } from './GiftVoucherModal';
import { LaybyModal } from './LaybyModal';
import { CustomerRequestModal } from './CustomerRequestModal';

export const EmployeeDashboard = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side - Employee Tasks and Notes */}
      <div className="lg:col-span-2 space-y-6">
        <TaskList />
        <EmployeeNotes />
      </div>

      {/* Right Side - Urgent Items and Quick Actions */}
      <div className="space-y-6">
        <UrgentItems />
        
        {/* Quick Actions */}
        <div className="neo-card p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => openModal('voucher')}
              className="neo-button bg-neo-pink text-white w-full"
            >
              🎁 Gift Vouchers
            </button>
            <button
              onClick={() => openModal('layby')}
              className="neo-button bg-neo-blue text-white w-full"
            >
              📦 Layby Tracker
            </button>
            <button
              onClick={() => openModal('request')}
              className="neo-button bg-neo-green text-white w-full"
            >
              🌿 Customer Requests
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'voucher' && <GiftVoucherModal onClose={closeModal} />}
      {activeModal === 'layby' && <LaybyModal onClose={closeModal} />}
      {activeModal === 'request' && <CustomerRequestModal onClose={closeModal} />}
    </div>
  );
};
