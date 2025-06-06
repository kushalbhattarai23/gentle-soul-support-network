import React, { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuthStore();
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <button
          className="p-2 rounded-md hover:bg-slate-100 focus:outline-none md:hidden"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-slate-900 ml-2 md:ml-0">
          <span className="md:hidden">FinTrackr</span>
          <span className="hidden md:inline">Personal Finance Tracker</span>
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-slate-100 focus:outline-none relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <User size={16} />
            </div>
            <span className="hidden md:block text-sm font-medium">{user?.email}</span>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-slate-200">
              <div className="py-1">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Profile
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Settings
                </a>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                >
                  <span className="flex items-center">
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};