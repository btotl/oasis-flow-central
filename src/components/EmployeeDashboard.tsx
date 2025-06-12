
import { useState } from 'react';
import { GiftVoucherModal } from './GiftVoucherModal';
import { LaybyModal } from './LaybyModal';
import { CustomerRequestModal } from './CustomerRequestModal';
import { EmployeeTaskSection } from './employee/EmployeeTaskSection';
import { EmployeeNotesSection } from './employee/EmployeeNotesSection';
import { EmployeeTimeSection } from './employee/EmployeeTimeSection';
import { EmployeeUrgentSection } from './employee/EmployeeUrgentSection';
import { EmployeeQuickActions } from './employee/EmployeeQuickActions';

export const EmployeeDashboard = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Left Side - Employee Tasks and Notes */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        <EmployeeTaskSection />
        <EmployeeNotesSection />
      </div>

      {/* Right Side - Time Tracking, Urgent Items and Quick Actions */}
      <div className="space-y-4 sm:space-y-6">
        <EmployeeTimeSection />
        <EmployeeUrgentSection />
        <EmployeeQuickActions onOpenModal={openModal} />
      </div>

      {/* Modals */}
      {activeModal === 'voucher' && <GiftVoucherModal onClose={closeModal} />}
      {activeModal === 'layby' && <LaybyModal onClose={closeModal} />}
      {activeModal === 'request' && <CustomerRequestModal onClose={closeModal} />}
    </div>
  );
};
