import React, { useEffect } from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuthStore } from '../store/authStore';

export const SignUpPage: React.FC = () => {
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (user) {
      window.location.href = '/';
    }
  }, [user]);
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-emerald-600">FinTrackr</h1>
        <h2 className="mt-3 text-center text-xl font-semibold text-slate-900">
          Create a new account
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
};