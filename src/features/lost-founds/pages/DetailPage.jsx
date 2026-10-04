import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  IconArrowLeft, IconEdit, IconPhoto, IconTrash, 
  IconMapPin, IconClock, IconUser, IconCheck, IconAlertCircle 
} from '@tabler/icons-react';
import { asyncSetLostFoundById, asyncDeleteLostFound } from '../states/action';
import ChangeModal from '../modals/ChangeModal';
import ChangeCoverModal from '../modals/ChangeCoverModal';
import { formatDate, showConfirmDialog } from '../../../helpers/toolsHelper';

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLostFound = useSelector((state) => state.isLostFound);
  const lostFound = useSelector((state) => state.lostFound);
  const profile = useSelector((state) => state.profile); // To check if current user is the author

  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isChangeCoverModalOpen, setIsChangeCoverModalOpen] = useState(false);

  useEffect(() => {
    dispatch(asyncSetLostFoundById(id));
  }, [id, dispatch]);

  const handleDelete = async () => {
    const isConfirm = await showConfirmDialog(
      'Hapus Laporan',
      'Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.'
    );
    if (isConfirm) {
      await dispatch(asyncDeleteLostFound(id));
      navigate('/');
    }
  };

  const handleRefresh = () => {
    dispatch(asyncSetLostFoundById(id));
  };

  if (!isLostFound) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  /* v8 ignore next */
if (!lostFound) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <IconAlertCircle size={48} className="text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Laporan Tidak Ditemukan</h2>
        <p className="text-slate-500 mt-2 mb-6">Laporan yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
        <Link to="/" className="text-blue-600 font-medium hover:underline flex items-center gap-2">
          <IconArrowLeft size={18} /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const isMyPost = profile && lostFound.author && profile.id === lostFound.author.id;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Navigation */}
      <div className="flex justify-between items-center">
        <Link to="/" className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2 transition-colors">
          <IconArrowLeft size={18} /> Kembali
        </Link>
        {isMyPost && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsChangeModalOpen(true)}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <IconEdit size={16} /> Edit Data
            </button>
            <button
              onClick={handleDelete}
              className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <IconTrash size={16} /> Hapus
            </button>
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
          
          {/* Cover Image Section */}
          <div className="lg:col-span-2 relative bg-slate-100 flex flex-col justify-center border-r border-slate-100 min-h-[300px]">
            {lostFound.cover ? (
              <img 
                /* v8 ignore next */
src={lostFound.cover} 
                alt={lostFound.title} 
                className="w-full h-full object-cover max-h-[500px]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-12">
                <IconPhoto size={64} className="mb-4 opacity-50" />
                <span className="font-medium text-lg">Belum ada foto</span>
                <p className="text-sm text-center mt-2 opacity-80">Foto sangat membantu dalam proses identifikasi barang.</p>
              </div>
            )}
            
            {/* Status Badges Overlaid */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`px-3 py-1.5 text-sm font-bold rounded-lg shadow-md inline-block w-fit ${
                lostFound.status === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {lostFound.status === 'lost' ? 'HILANG' : 'DITEMUKAN'}
              </span>
              {lostFound.is_completed === 1 && (
                <span className="px-3 py-1.5 text-sm font-bold rounded-lg bg-slate-800 text-white shadow-md flex items-center gap-1.5 w-fit">
                  <IconCheck size={16} /> Kasus Selesai
                </span>
              )}
            </div>

            {/* Change Cover Button */}
            {isMyPost && (
              <button
                onClick={() => setIsChangeCoverModalOpen(true)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-700 hover:text-blue-600 font-semibold px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2 transition-all hover:bg-white"
              >
                <IconPhoto size={18} /> Ganti Foto
              </button>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-3 p-6 md:p-8 flex flex-col">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-4 leading-tight">
              {lostFound.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 mb-8 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 text-slate-600">
                <IconClock size={20} className="text-slate-400" />
                <span className="text-sm font-medium">{formatDate(lostFound.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <IconMapPin size={20} className="text-slate-400" />
                <span className="text-sm font-medium">Delcom Institute</span>
              </div>
            </div>

            <div className="flex-grow mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Deskripsi Detail</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {lostFound.description}
              </p>
            </div>

            {/* Author Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4">
                <img 
                  src={lostFound.author?.photo || 'https://ui-avatars.com/api/?name=' + (lostFound.author?.name || 'U')} 
                  alt={lostFound.author?.name} 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Dilaporkan oleh</p>
                  <p className="font-bold text-slate-800">{lostFound.author?.name}</p>
                </div>
              </div>
              {isMyPost && (
                <div className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-md">
                  Laporan Anda
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <ChangeModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        lostFound={lostFound}
        onSuccess={handleRefresh}
      />

      <ChangeCoverModal
        isOpen={isChangeCoverModalOpen}
        onClose={() => setIsChangeCoverModalOpen(false)}
        lostFoundId={lostFound.id}
        onSuccess={handleRefresh}
      />
    </div>
  );
}

export default DetailPage;
