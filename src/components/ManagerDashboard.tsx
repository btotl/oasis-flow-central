
import { useState } from 'react';
import { TaskList } from './TaskList';
import { EmployeeNotes } from './EmployeeNotes';
import { GiftVoucherModal } from './GiftVoucherModal';
import { LaybyModal } from './LaybyModal';
import { CustomerRequestModal } from './CustomerRequestModal';

export const ManagerDashboard = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Manager Overview */}
      <div className="neo-card p-6 bg-neo-purple/20">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">👨‍💼 Manager Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="neo-card p-4 bg-neo-yellow text-center">
            <h3 className="text-2xl font-bold">12</h3>
            <p className="text-gray-800 font-medium">Active Tasks</p>
          </div>
          <div className="neo-card p-4 bg-neo-pink text-center">
            <h3 className="text-2xl font-bold">$1,250</h3>
            <p className="text-gray-800 font-medium">Gift Vouchers</p>
          </div>
          <div className="neo-card p-4 bg-neo-blue text-center">
            <h3 className="text-2xl font-bold">7</h3>
            <p className="text-gray-800 font-medium">Active Laybys</p>
          </div>
          <div className="neo-card p-4 bg-neo-green text-center">
            <h3 className="text-2xl font-bold">15</h3>
            <p className="text-gray-800 font-medium">Pending Requests</p>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="neo-card p-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Management Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => openModal('voucher')}
            className="neo-button bg-neo-pink text-white h-16"
          >
            🎁 Manage Gift Vouchers
          </button>
          <button
            onClick={() => openModal('layby')}
            className="neo-button bg-neo-blue text-white h-16"
          >
            📦 Manage Laybys
          </button>
          <button
            onClick={() => openModal('request')}
            className="neo-button bg-neo-green text-white h-16"
          >
            🌿 Manage Customer Requests
          </button>
        </div>
      </div>

      {/* Tasks and Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskList />
        <EmployeeNotes />
      </div>

      {/* Modals */}
      {activeModal === 'voucher' && <GiftVoucherModal onClose={closeModal} />}
      {activeModal === 'layby' && <LaybyModal onClose={closeModal} />}
      {activeModal === 'request' && <CustomerRequestModal onClose={closeModal} />}
    </div>
  );
};
