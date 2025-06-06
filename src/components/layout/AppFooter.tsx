import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Tv, Wallet, Home } from 'lucide-react';

export const AppFooter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show footer on landing page
  if (location.pathname === '/') {
    return null;
  }

  const isFinanceApp = location.pathname.includes('/wallets') || 
                       location.pathname.includes('/transactions') || 
                       location.pathname.includes('/categories') || 
                       location.pathname.includes('/calendar') || 
                       location.pathname.includes('/financedashboard');

  const isTvApp = location.pathname.includes('/shows') || 
                  location.pathname.includes('/universes') || 
                  location.pathname.includes('/dashboard') || 
                  location.pathname.includes('/admin') || 
                  location.pathname.includes('/show/') || 
                  location.pathname.includes('/universe/');

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="container mx-auto flex justify-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
        
        {!isTvApp && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/shows/public')}
            className="flex items-center space-x-2"
          >
            <Tv className="h-4 w-4" />
            <span>TV Tracker</span>
          </Button>
        )}
        
        {!isFinanceApp && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/financedashboard')}
            className="flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span>Finance Tracker</span>
          </Button>
        )}
      </div>
    </footer>
  );
};
