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

  // Removed blocking full-page loader to improve LCP. 
  // Navbar Component already handles empty profile gracefully.

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
