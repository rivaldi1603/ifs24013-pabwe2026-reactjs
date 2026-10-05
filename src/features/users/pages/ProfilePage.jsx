import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconUserCircle,
  IconCamera,
  IconDeviceFloppy,
  IconKey,
} from '@tabler/icons-react';
import {
  asyncPutProfile,
  asyncPostProfilePhoto,
  asyncPutProfilePassword,
  setIsChangeProfileActionCreator,
  setIsChangeProfilePhotoActionCreator,
  setIsChangeProfilePasswordActionCreator,
} from '../states/action';
import { showErrorDialog } from '../../../helpers/toolsHelper';

function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const isChangeProfile = useSelector((state) => state.isChangeProfile);
  const isChangeProfilePhoto = useSelector((state) => state.isChangeProfilePhoto);
  const isChangeProfilePassword = useSelector(
    (state) => state.isChangeProfilePassword
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  useEffect(() => {
    if (isChangeProfile) {
      dispatch(setIsChangeProfileActionCreator(false));
    }
    if (isChangeProfilePhoto) {
      setPhotoFile(null);
      dispatch(setIsChangeProfilePhotoActionCreator(false));
    }
    if (isChangeProfilePassword) {
      setPassword('');
      setNewPassword('');
      dispatch(setIsChangeProfilePasswordActionCreator(false));
    }
  }, [
    isChangeProfile,
    isChangeProfilePhoto,
    isChangeProfilePassword,
    dispatch,
  ]);

  async function onProfileSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      await showErrorDialog('Validasi Gagal', 'Nama dan email wajib diisi!');
      return;
    }
    await dispatch(asyncPutProfile({ name, email }));
  }

  async function onPhotoSubmit(event) {
    event.preventDefault();
    if (!photoFile) {
      await showErrorDialog('Validasi Gagal', 'Pilih berkas foto terlebih dahulu!');
      return;
    }
    await dispatch(asyncPostProfilePhoto(photoFile));
  }

  async function onPasswordSubmit(event) {
    event.preventDefault();
    if (!password.trim() || !newPassword.trim()) {
      await showErrorDialog(
        'Validasi Gagal',
        'Kata sandi lama dan kata sandi baru wajib diisi!'
      );
      return;
    }
    if (newPassword.length < 6) {
      await showErrorDialog(
        'Validasi Gagal',
        'Kata sandi baru minimal terdiri dari 6 karakter!'
      );
      return;
    }
    await dispatch(
      asyncPutProfilePassword({ password, new_password: newPassword })
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-600">
        <h1 className="sr-only">Profil Saya</h1>
        Memuat informasi profil...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <IconUserCircle className="text-blue-600" size={28} />
          <span>Profil &amp; Pengaturan Akun</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola informasi identitas, foto avatar, dan keamanan kata sandi Anda
        </p>
      </div>

      {/* Kartu Foto Profil */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={
            profile.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.name || 'User'
            )}&background=2563eb&color=fff`
          }
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-600"
        />

        <form onSubmit={onPhotoSubmit} className="flex-1 space-y-3 w-full">
          <h2 className="font-semibold text-slate-900">Foto Avatar</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="file"
              accept="image/*"
              aria-label="Pilih Foto Profil"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition cursor-pointer"
            >
              <IconCamera size={18} />
              <span>Unggah Foto</span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Ubah Informasi Profil */}
        <form
          onSubmit={onProfileSubmit}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
        >
          <h2 className="font-bold text-slate-900 text-lg">Informasi Pribadi</h2>

          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nama Lengkap
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Alamat Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
          >
            <IconDeviceFloppy size={18} />
            <span>Simpan Perubahan</span>
          </button>
        </form>

        {/* Form Ubah Kata Sandi */}
        <form
          onSubmit={onPasswordSubmit}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
        >
          <h2 className="font-bold text-slate-900 text-lg">Ganti Kata Sandi</h2>

          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Kata Sandi Saat Ini
            </label>
            <input
              id="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi lama"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Kata Sandi Baru
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
          >
            <IconKey size={18} />
            <span>Perbarui Kata Sandi</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;