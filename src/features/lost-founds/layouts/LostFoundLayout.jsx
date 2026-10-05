import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavbarComponent from '../components/NavbarComponent';
import SidebarComponent from '../components/SidebarComponent';
import apiHelper from '../../../helpers/apiHelper';
import { asyncSetProfile } from '../../users/states/action';

function LostFoundLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isProfile = useSelector((state) => state.isProfile);
  const profile = useSelector((state) => state.profile);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = apiHelper.getAccessToken();
    if (!token) {
      navigate('/auth/login');
      return;
    }

    if (!isProfile) {
      dispatch(asyncSetProfile());
    } else if (isProfile && !profile) {
      // If profile fetch failed, token might be invalid
      apiHelper.removeAccessToken();
      navigate('/auth/login');
    }
  }, [isProfile, profile, navigate, dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!isProfile) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-50">
        <h1 className="sr-only">Memuat Delcom Lost &amp; Founds</h1>
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <NavbarComponent toggleSidebar={toggleSidebar} />
      <SidebarComponent isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default LostFoundLayout;
