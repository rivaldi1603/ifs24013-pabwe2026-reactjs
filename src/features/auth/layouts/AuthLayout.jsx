import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiHelper from '../../../helpers/apiHelper';

function AuthLayout() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser);

  useEffect(() => {
    // If the user has access token or authUser state is set, redirect to dashboard
    const token = apiHelper.getAccessToken();
    if (token || authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Visual Banner for Desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 opacity-90"></div>
        <div className="relative z-10 text-white p-12 flex flex-col items-start justify-center h-full">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            Delcom <br /> Lost & Founds
          </h1>
          <p className="text-xl text-blue-100 font-medium mb-8 max-w-md">
            Platform terpadu untuk melaporkan dan menemukan barang yang hilang di lingkungan sekitar Anda.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center bg-blue-800/50 rounded-lg p-4 backdrop-blur-sm border border-blue-500/30">
              <span className="text-3xl mr-3">🔍</span>
              <div>
                <div className="font-bold">Lapor Hilang</div>
                <div className="text-sm text-blue-200">Bantu temukan barang</div>
              </div>
            </div>
            <div className="flex items-center bg-indigo-800/50 rounded-lg p-4 backdrop-blur-sm border border-indigo-500/30">
              <span className="text-3xl mr-3">✨</span>
              <div>
                <div className="font-bold">Lapor Temuan</div>
                <div className="text-sm text-indigo-200">Kembalikan hak milik</div>
              </div>
            </div>
          </div>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      {/* Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 lg:hidden">
            <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Delcom</h1>
            <p className="text-slate-500 font-medium mt-1">Lost & Founds</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
