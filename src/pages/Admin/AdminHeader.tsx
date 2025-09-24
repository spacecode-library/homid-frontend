import { BarChart3, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminHeader: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage platform operations and monitor system activity</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className='text-center flex items-center gap-x-3'>
              <Link to="/admin-analytics">
                <button className='bg-blue-400 text-white py-2 rounded-[8px] px-4'>Analytics</button>
              </Link>

              <Link to="/traffic">
                <button className='bg-red-300 text-white py-2 rounded-[8px] px-4'>Traffic</button>
              </Link>

              <Link to="/country-traffic">
                <button className='bg-red-300 text-white py-2 rounded-[8px] px-4'>Country Traffic</button>
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
