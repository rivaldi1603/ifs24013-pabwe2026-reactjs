import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IconSearch, IconFilter, IconPlus, IconBox, IconMapPin, IconCheck, IconClock } from '@tabler/icons-react';
import { asyncSetLostFounds, asyncSetLostFoundStats } from '../states/action';
import AddModal from '../modals/AddModal';
import { formatDate } from '../../../helpers/toolsHelper';

function HomePage() {
  const dispatch = useDispatch();
  const lostFounds = useSelector((state) => state.lostFounds);
  const stats = useSelector((state) => state.lostFoundStats);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // '' (all), 'lost', 'found'
  const [filterCompleted, setFilterCompleted] = useState(''); // '' (all), '1', '0'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
    dispatch(asyncSetLostFoundStats());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterCompleted]);

  const fetchData = () => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterCompleted !== '') params.is_completed = filterCompleted;
    dispatch(asyncSetLostFounds(params));
  };

  // Live search filtering locally since API might not support ?search=
  const filteredData = lostFounds?.filter((item) => {
    if (!searchQuery) return true;
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.description.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Laporan</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola dan pantau semua laporan kehilangan dan penemuan.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-500/30"
        >
          <IconPlus size={20} />
          Laporan Baru
        </button>
      </div>

      {/* Stats Cards (Mocking some values from stats if available, otherwise fallback) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <IconBox size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Laporan</p>
            <p className="text-2xl font-bold text-slate-800">{lostFounds?.length || 0}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <IconMapPin size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Barang Hilang</p>
            <p className="text-2xl font-bold text-slate-800">
              {lostFounds?.filter(item => item.status === 'lost').length || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <IconBox size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Barang Ditemukan</p>
            <p className="text-2xl font-bold text-slate-800">
              {lostFounds?.filter(item => item.status === 'found').length || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <IconCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Selesai (Ditutup)</p>
            <p className="text-2xl font-bold text-slate-800">
              {lostFounds?.filter(item => item.is_completed === 1).length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <IconSearch size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul atau deskripsi..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm"
          />
        </div>
        
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-40">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconFilter size={16} />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm appearance-none bg-white"
            >
              <option value="">Semua Status</option>
              <option value="lost">Kehilangan</option>
              <option value="found">Ditemukan</option>
            </select>
          </div>
          <div className="relative w-full sm:w-40">
            <select
              value={filterCompleted}
              onChange={(e) => setFilterCompleted(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
            >
              <option value="">Semua Progres</option>
              <option value="0">Belum Selesai</option>
              <option value="1">Sudah Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            <IconBox size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-medium">Tidak ada data ditemukan</p>
            <p className="text-sm">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          filteredData.map((item) => (
            <Link
              to={`/lost-founds/${item.id}`}
              key={item.id}
              className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                    <IconPhoto size={40} className="mb-2 opacity-50" />
                    <span className="text-xs font-medium uppercase tracking-wider">Tanpa Foto</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-sm ${
                    item.status === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {item.status === 'lost' ? 'HILANG' : 'DITEMUKAN'}
                  </span>
                  {item.is_completed === 1 && (
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-800 text-white shadow-sm flex items-center gap-1">
                      <IconCheck size={12} /> Selesai
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={item.author?.photo || 'https://ui-avatars.com/api/?name=' + (item.author?.name || 'U')}
                      alt={item.author?.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="truncate max-w-[100px]">{item.author?.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconClock size={14} />
                    <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}

// Temporary import for the placeholder icon, moving it here so it doesn't break if not at top
import { IconPhoto } from '@tabler/icons-react';

export default HomePage;
