import React from 'react';
import { AllIDsTable } from './AllIDsTable';
import { AdminHeader } from './AdminHeader';

export const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto">
        <AllIDsTable />
      </div>
    </div>
  );
};