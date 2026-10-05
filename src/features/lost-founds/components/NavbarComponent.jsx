import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { IconMenu2, IconUser, IconLogout, IconChevronDown } from '@tabler/icons-react';
import { asyncSetAuthLogout } from '../../auth/states/action';
import { showConfirmDialog } from '../../../helpers/toolsHelper';

function NavbarComponent({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.profile);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const isConfirm = await showConfirmDialog('Logout', 'Apakah Anda yakin ingin keluar?');
    if (isConfirm) {
      await dispatch(asyncSetAuthLogout());
      navigate('/auth/login');
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 fixed z-30 w-full top-0">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              type="button"
              aria-label="Buka menu navigasi"
              onClick={toggleSidebar}
              className="p-2 text-slate-600 rounded cursor-pointer lg:hidden hover:text-slate-900 hover:bg-slate-100 focus:bg-slate-100 focus:ring-2 focus:ring-slate-100"
            >
              <IconMenu2 size={24} />
            </button>
            <Link to="/" className="text-xl font-bold flex items-center lg:ml-2.5">
              <span className="self-center whitespace-nowrap text-blue-600">Lost & Founds</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button
                type="button"
                className="flex text-sm bg-slate-50 rounded-full focus:ring-4 focus:ring-slate-200 items-center border border-slate-200 px-3 py-1.5"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  className="w-8 h-8 rounded-full bg-blue-100 object-cover"
                  src={profile?.photo || 'https://ui-avatars.com/api/?name=' + (profile?.name || 'U')}
                  alt="user photo"
                />
                <span className="ml-2 font-semibold text-slate-700 hidden sm:block">
                  {profile?.name || 'User'}
                </span>
                <IconChevronDown size={16} className="ml-1 text-slate-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 z-50 w-48 text-base list-none bg-white rounded divide-y divide-slate-100 shadow border border-slate-200">
                  <div className="px-4 py-3">
                    <p className="text-sm text-slate-900 font-semibold">{profile?.name || '-'}</p>
                    <p className="text-sm font-medium text-slate-500 truncate">{profile?.email || '-'}</p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <IconUser size={18} className="mr-2" />
                        Profil Saya
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                      >
                        <IconLogout size={18} className="mr-2" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
