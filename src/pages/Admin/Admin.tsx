import React from 'react';
import {
  Shield,
  Bell,
  Settings,
  Users,
  BarChart3
} from 'lucide-react';
import { AllIDsTable } from './AllIDsTable';
import { Link } from 'react-router-dom';

const AdminHeader: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage platform operations and monitor system activity</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className='text-center'>
              <Link to="/admin-analytics">
                <button className='bg-blue-400 text-white py-2 rounded-[8px] px-4'>Analytics</button>
              </Link>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">15.4K</div>
              <div className="text-xs text-gray-500 flex items-center">
                <Users size={12} className="mr-1" />
                Total Users
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">892K</div>
              <div className="text-xs text-gray-500 flex items-center">
                <BarChart3 size={12} className="mr-1" />
                Redirects
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex items-center space-x-3">
            {/* <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings size={20} />
            </button> */}

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-600">System Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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