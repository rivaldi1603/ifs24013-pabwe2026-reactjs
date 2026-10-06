/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconX, IconDeviceFloppy } from '@tabler/icons-react';
import { asyncPutLostFound } from '../states/action';

function ChangeModal({ isOpen, onClose, lostFound, onSuccess }) {
  const dispatch = useDispatch();
  const isLostFoundChange = useSelector((state) => state.isLostFoundChange);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('lost');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (lostFound && isOpen) {
      setTitle(lostFound.title || '');
      setDescription(lostFound.description || '');
      setStatus(lostFound.status || 'lost');
      setIsCompleted(lostFound.is_completed === 1);
    }
  }, [lostFound, isOpen]);

  if (!isOpen || !lostFound) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      asyncPutLostFound(lostFound.id, {
        title,
        description,
        status,
        is_completed: isCompleted ? 1 : 0,
      })
    );
    
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-full">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Ubah Laporan</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="edit-title">
                Judul Laporan
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Jenis Laporan
              </label>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${status === 'lost' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="edit-status"
                    value="lost"
                    checked={status === 'lost'}
                    onChange={(e) => setStatus(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-sm">Kehilangan (Lost)</span>
                </label>
                <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${status === 'found' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="edit-status"
                    value="found"
                    checked={status === 'found'}
                    onChange={(e) => setStatus(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-sm">Menemukan (Found)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="edit-description">
                Deskripsi Detail
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isCompleted ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isCompleted ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-semibold text-slate-700">
                  Tandai sebagai selesai (Kasus ditutup)
                </div>
              </label>
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundChange || !title || !description}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 transition-colors"
            >
              {isLostFoundChange ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <IconDeviceFloppy size={18} />
              )}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeModal;
