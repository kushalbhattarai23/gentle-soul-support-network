import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { AuthProvider } from './components/auth/AuthProvider';
import { Navigation } from './components/Navigation';
import { Toaster } from '@/components/ui/toaster';

// Pages from App 1
import { Dashboard } from './pages/Dashboard';
import { AdminPortal } from './pages/AdminPortal';
import { PublicShows } from './pages/PublicShows';
import { MyShows } from './pages/MyShows';
import { PublicUniverses } from './pages/PublicUniverses';
import { MyUniverses } from './pages/MyUniverses';
import { UniversePage } from './pages/UniversePage';
import { UniverseDetail } from './pages/UniverseDetail';
import { UniverseDashboard } from './pages/UniverseDashboard';
import { ShowDetail } from './pages/ShowDetail';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

// Pages from App 2
import { DashboardPage } from './pages/DashboardPage';
import { WalletsPage } from './pages/WalletsPage';
import { WalletDetailsPage } from './pages/WalletDetailsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CalendarPage } from './pages/CalendarPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryReportsPage } from './pages/CategoryReportsPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';

function App() {
  const { user, isLoading, getUser } = useAuthStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          {user && <Navigation />}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {user ? (
                <>
                  {/* Original app routes */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminPortal />} />
                  <Route path="/shows/public" element={<PublicShows />} />
                  <Route path="/shows/my" element={<MyShows />} />
                  <Route path="/universes/public" element={<PublicUniverses />} />
                  <Route path="/universes/my" element={<MyUniverses />} />
                  <Route path="/universes" element={<UniversePage />} />
                  <Route path="/universe/:universeSlug" element={<UniverseDetail />} />
                  <Route path="/universe/:universeSlug/dashboard" element={<UniverseDashboard />} />
                  <Route path="/show/:showSlug" element={<ShowDetail />} />

                  {/* Added from second app */}
                  <Route path="/wallets" element={<WalletsPage />} />
                  <Route path="/wallets/:id" element={<WalletDetailsPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/category-report" element={<CategoryReportsPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />

                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              ) : (
                <>
                  {/* Public-only routes */}
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />

                  {/* Catch-all redirect for unauthenticated users */}
                  <Route path="*" element={<Navigate to="/sign-in" replace />} />
                </>
              )}
            </Routes>
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
