
import { useState } from 'react';
import { Package, Gift, Users, FileText, Archive, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GiftVoucherModal } from '@/components/GiftVoucherModal';
import { LaybyModal } from '@/components/LaybyModal';
import { CustomerRequestModal } from '@/components/CustomerRequestModal';
import { ArchiveManager } from '@/components/ArchiveManager';
import { TimeLogsModal } from '@/components/TimeLogsModal';

export interface ManagementToolsProps {
  onOpenModal?: (modalType: string) => void;
}

export const ManagementTools = ({ onOpenModal }: ManagementToolsProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [showTimeLogs, setShowTimeLogs] = useState(false);

  const handleOpenModal = (modalType: string) => {
    if (onOpenModal) {
      onOpenModal(modalType);
    }
    setActiveModal(modalType);
  };

  return (
    <>
      <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-green/20 to-neo-blue/20">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Management Tools</h3>
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleOpenModal('voucher')}
            className="neo-button bg-neo-yellow text-black w-full justify-start"
          >
            <Gift size={20} className="mr-2" />
            Gift Vouchers
          </Button>
          <Button
            onClick={() => handleOpenModal('layby')}
            className="neo-button bg-neo-purple text-white w-full justify-start"
          >
            <Package size={20} className="mr-2" />
            Laybys
          </Button>
          <Button
            onClick={() => handleOpenModal('request')}
            className="neo-button bg-neo-orange text-white w-full justify-start"
          >
            <Users size={20} className="mr-2" />
            Customer Requests
          </Button>
          <Button
            onClick={() => setShowTimeLogs(true)}
            className="neo-button bg-neo-blue text-white w-full justify-start"
          >
            <FileText size={20} className="mr-2" />
            Time Logs
          </Button>
          <Button
            onClick={() => setShowArchive(true)}
            className="neo-button bg-gray-500 text-white w-full justify-start"
          >
            <Archive size={20} className="mr-2" />
            Archive
          </Button>
        </div>
      </div>

      {activeModal === 'voucher' && (
        <GiftVoucherModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'layby' && (
        <LaybyModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'request' && (
        <CustomerRequestModal onClose={() => setActiveModal(null)} />
      )}
      {showArchive && (
        <ArchiveManager onClose={() => setShowArchive(false)} />
      )}
      {showTimeLogs && (
        <TimeLogsModal onClose={() => setShowTimeLogs(false)} />
      )}
    </>
  );
};
