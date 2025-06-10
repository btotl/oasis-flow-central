
import { useState } from 'react';
import { EmployeeDashboard } from '@/components/EmployeeDashboard';
import { ManagerDashboard } from '@/components/ManagerDashboard';

const Index = () => {
  const [isManagerView, setIsManagerView] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="neo-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">
              🌱 Plant Nursery Dashboard
            </h1>
            <button
              onClick={() => setIsManagerView(!isManagerView)}
              className="neo-button bg-neo-purple text-white"
            >
              {isManagerView ? '👥 Employee View' : '👨‍💼 Manager View'}
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {isManagerView ? <ManagerDashboard /> : <EmployeeDashboard />}
      </div>
    </div>
  );
};

export default Index;
