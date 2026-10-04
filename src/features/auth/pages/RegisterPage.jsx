import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../../../hooks/useInput';
import { asyncSetAuthRegister } from '../states/action';
import { IconMail, IconLock, IconUser, IconEye, IconEyeOff, IconUserPlus } from '@tabler/icons-react';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthRegister = useSelector((state) => state.isAuthRegister);
  
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* v8 ignore next */
if (!name || !email || !password) return;
    
    // We can await the dispatch since we made it return a boolean indicating success
    const success = await dispatch(asyncSetAuthRegister({ name, email, password }));
    if (success) {
      navigate('/auth/login');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Buat Akun Baru</h2>
        <p className="text-slate-500 text-sm">Bergabunglah untuk mulai melaporkan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="name">
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconUser size={20} />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Nama lengkap Anda"
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconMail size={20} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="nama@email.com"
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconLock size={20} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={onPasswordChange}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAuthRegister || !name || !email || !password}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-md shadow-blue-500/30"
        >
          {isAuthRegister ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <IconUserPlus size={20} />
              Daftar
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Sudah punya akun?{' '}
        <Link to="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
