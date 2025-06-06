import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tv, Wallet, BarChart3, Calendar, PieChart, Play } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Your Personal Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your application to get started. Track your favorite TV shows or manage your personal finances.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* TV Show Tracker App */}
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group" onClick={() => navigate('/shows/public')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Tv className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">TV Show Tracker</CardTitle>
              <CardDescription className="text-gray-600">
                Track your favorite TV shows, episodes, and discover new universes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Episode Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Progress Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tv className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Show Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Air Date Tracking</span>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/shows/public')}>
                Open TV Tracker
              </Button>
            </CardContent>
          </Card>

          {/* Finance Tracker App */}
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group" onClick={() => navigate('/financedashboard')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <Wallet className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Finance Tracker</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your personal finances, track expenses, and monitor your budget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-600">Wallet Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-600">Expense Reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PieChart className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-600">Category Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-gray-600">Transaction History</span>
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/financedashboard')}>
                Open Finance Tracker
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};