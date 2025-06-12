
import { useState, useEffect } from 'react';
import { EmployeeDashboard } from '@/components/EmployeeDashboard';
import { ManagerDashboard } from '@/components/ManagerDashboard';
import { PasswordModal } from '@/components/PasswordModal';
import { ImportantMessageModal, ImportantMessage } from '@/components/ImportantMessage';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user, profile, signOut, loading } = useAuth();
  const [isManagerView, setIsManagerView] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(false);
  const [importantMessages, setImportantMessages] = useState<ImportantMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ImportantMessage | null>(null);

  // Redirect to auth if not logged in
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (profile?.role === 'manager') {
      setIsManagerAuthenticated(true);
      // Check if manager was previously in manager view (persistent session)
      const wasManagerView = localStorage.getItem('isManagerView') === 'true';
      if (wasManagerView) {
        setIsManagerView(true);
      }
    }
  }, [profile]);

  useEffect(() => {
    fetchImportantMessages();
  }, [user]);

  // Persist manager view state
  useEffect(() => {
    localStorage.setItem('isManagerView', isManagerView.toString());
  }, [isManagerView]);

  const fetchImportantMessages = async () => {
    if (!user) return;
    
    try {
      const { data: messages, error } = await supabase
        .from('important_messages')
        .select(`
          *,
          message_acknowledgments (
            employee_id,
            acknowledged_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedMessages = messages?.map(msg => ({
        id: msg.id,
        title: msg.title,
        content: msg.content,
        createdBy: msg.created_by,
        createdAt: new Date(msg.created_at),
        acknowledgedBy: msg.message_acknowledgments?.map((ack: any) => ({
          employeeName: ack.employee_id,
          acknowledgedAt: new Date(ack.acknowledged_at)
        })) || []
      })) || [];
      
      setImportantMessages(formattedMessages);
      
      // Check for unacknowledged messages
      const unacknowledgedMessage = formattedMessages.find(msg => 
        !msg.acknowledgedBy.some(ack => ack.employeeName === user.id)
      );
      
      if (unacknowledgedMessage && !isManagerView) {
        setCurrentMessage(unacknowledgedMessage);
      }
    } catch (error) {
      console.error('Error fetching important messages:', error);
    }
  };

  const handleManagerViewToggle = () => {
    if (isManagerView) {
      // Switch back to employee view
      setIsManagerView(false);
      setIsManagerAuthenticated(profile?.role === 'manager');
    } else {
      // Check if user is already a manager
      if (profile?.role === 'manager') {
        setIsManagerView(true);
      } else {
        // Request manager access via password
        setShowPasswordModal(true);
      }
    }
  };

  const handlePasswordSuccess = () => {
    setIsManagerAuthenticated(true);
    setIsManagerView(true);
    setShowPasswordModal(false);
  };

  const handleMessageAcknowledge = async (messageId: string, employeeName: string) => {
    try {
      const { error } = await supabase
        .from('message_acknowledgments')
        .insert({
          message_id: messageId,
          employee_id: user?.id
        });
      
      if (error) throw error;
      
      setCurrentMessage(null);
      fetchImportantMessages();
    } catch (error) {
      console.error('Error acknowledging message:', error);
    }
  };

  const handleRemindLater = (messageId: string) => {
    setCurrentMessage(null);
    // Set a timeout to show the message again later
    setTimeout(() => {
      const message = importantMessages.find(msg => msg.id === messageId);
      if (message) {
        setCurrentMessage(message);
      }
    }, 60000); // 1 minute for demo purposes
  };

  const handleSignOut = () => {
    // Clear manager view state on sign out
    localStorage.removeItem('isManagerView');
    signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="neo-card p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="neo-card p-4 sm:p-6 mb-4 sm:mb-6 rounded-3xl bg-gradient-to-r from-neo-blue/20 to-neo-green/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 text-center sm:text-left">
              Plant Nursery Dashboard
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleManagerViewToggle}
                className={isManagerView ? 'neo-button' : 'neo-button-primary'}
              >
                {isManagerView ? 'Switch to Employee View' : 'Manager Access'}
              </button>
              <button
                onClick={handleSignOut}
                className="neo-button bg-red-500 text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
          {profile && (
            <div className="mt-2 text-gray-600">
              Welcome back, {profile.first_name}! ({profile.role})
              {isManagerView && <span className="ml-2 text-blue-600 font-medium">[Manager Mode]</span>}
            </div>
          )}
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
