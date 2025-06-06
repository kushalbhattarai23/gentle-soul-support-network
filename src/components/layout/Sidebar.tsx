import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, BarChart3, PieChart, Calendar, Settings, CreditCard, X } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Wallets', path: '/wallets', icon: <Wallet size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <CreditCard size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Categories', path: '/categories', icon: <PieChart size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <aside className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-emerald-600">FinTrackr</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-md hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`
              flex items-center px-4 py-3 rounded-md transition-colors
              ${isActive(item.path)
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
            
            {isActive(item.path) && (
              <span className="ml-auto w-1.5 h-5 bg-emerald-500 rounded-full"></span>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <div className="bg-emerald-50 p-4 rounded-lg">
          <h3 className="font-medium text-emerald-700 mb-1">Premium Plan</h3>
          <p className="text-sm text-emerald-600 mb-3">
            Upgrade to access advanced features!
          </p>
          <button className="w-full px-3 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};