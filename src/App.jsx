import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts (dimuat langsung karena selalu dibutuhkan)
import AuthLayout from './features/auth/layouts/AuthLayout';
import LostFoundLayout from './features/lost-founds/layouts/LostFoundLayout';

// Pages dimuat secara lazy (code-splitting) agar bundle awal lebih kecil
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'));
const HomePage = lazy(() => import('./features/lost-founds/pages/HomePage'));
const DetailPage = lazy(() => import('./features/lost-founds/pages/DetailPage'));
const UsersPage = lazy(() => import('./features/users/pages/UsersPage'));
const ProfilePage = lazy(() => import('./features/users/pages/ProfilePage'));

function PageLoader() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="sr-only">Memuat halaman...</h1>
      <div role="status" aria-live="polite" className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="sr-only">Memuat...</span>
      </div>
    </main>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<LostFoundLayout />}>
          <Route index element={<HomePage />} />
          <Route path="lost-founds/:id" element={<DetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <main className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-6">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">404 - Halaman Tidak Ditemukan</h1>
              <p className="text-slate-600 mb-8">Maaf, halaman yang Anda cari tidak ada.</p>
              <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Kembali ke Beranda
              </a>
            </main>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
