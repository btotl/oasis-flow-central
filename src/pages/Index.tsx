
import { useState, useEffect } from 'react';
import { EmployeeDashboard } from '@/components/EmployeeDashboard';
import { ManagerDashboard } from '@/components/ManagerDashboard';
import { PasswordModal } from '@/components/PasswordModal';
import { ImportantMessageModal, ImportantMessage } from '@/components/ImportantMessage';

const Index = () => {
  const [isManagerView, setIsManagerView] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(false);
  const [importantMessages, setImportantMessages] = useState<ImportantMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ImportantMessage | null>(null);

  useEffect(() => {
    const acknowledgedMessages = JSON.parse(localStorage.getItem('acknowledgedMessages') || '[]');
    
    // Check for important messages that haven't been acknowledged
    const unacknowledgedMessage = importantMessages.find(msg => 
      !acknowledgedMessages.includes(msg.id) &&
      !msg.acknowledgedBy.some(ack => ack.employeeName === 'Current Employee')
    );
    
    if (unacknowledgedMessage && !isManagerView) {
      setCurrentMessage(unacknowledgedMessage);
    }
  }, [importantMessages, isManagerView]);

  const handleManagerViewToggle = () => {
    if (isManagerView) {
      // Switch back to employee view
      setIsManagerView(false);
      setIsManagerAuthenticated(false);
    } else {
      // Request manager access
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsManagerAuthenticated(true);
    setIsManagerView(true);
    setShowPasswordModal(false);
  };

  const handleMessageAcknowledge = (messageId: string, employeeName: string) => {
    setImportantMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              acknowledgedBy: [
                ...msg.acknowledgedBy,
                { employeeName, acknowledgedAt: new Date() }
              ]
            }
          : msg
      )
    );
    setCurrentMessage(null);
  };

  const handleRemindLater = (messageId: string) => {
    setCurrentMessage(null);
    // Set a timeout to show the message again later (e.g., in 1 hour)
    setTimeout(() => {
      const acknowledgedMessages = JSON.parse(localStorage.getItem('acknowledgedMessages') || '[]');
      if (!acknowledgedMessages.includes(messageId)) {
        const message = importantMessages.find(msg => msg.id === messageId);
        if (message) {
          setCurrentMessage(message);
        }
      }
    }, 60000); // 1 minute for demo purposes
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="neo-card p-4 sm:p-6 mb-4 sm:mb-6 rounded-3xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 text-center sm:text-left">
              Plant Nursery Dashboard
            </h1>
            <button
              onClick={handleManagerViewToggle}
              className={isManagerView ? 'neo-button' : 'neo-button-primary'}
            >
              {isManagerView ? 'Switch to Employee View' : 'Manager Access'}
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {isManagerView && isManagerAuthenticated ? (
          <ManagerDashboard 
            importantMessages={importantMessages}
            setImportantMessages={setImportantMessages}
          />
        ) : (
          <EmployeeDashboard />
        )}

        {/* Modals */}
        {showPasswordModal && (
          <PasswordModal
            onSuccess={handlePasswordSuccess}
            onClose={() => setShowPasswordModal(false)}
          />
        )}

        {currentMessage && (
          <ImportantMessageModal
            message={currentMessage}
            onAcknowledge={handleMessageAcknowledge}
            onRemindLater={handleRemindLater}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
