import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconX, IconDeviceFloppy } from '@tabler/icons-react';
import useInput from '../../../hooks/useInput';
import { asyncPostLostFound } from '../states/action';

function AddModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const isLostFoundAdd = useSelector((state) => state.isLostFoundAdd);

  const [title, onTitleChange, setTitle] = useInput('');
  const [description, onDescriptionChange, setDescription] = useInput('');
  const [status, setStatus] = useState('lost');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await Promise.resolve(dispatch(asyncPostLostFound({ title, description, status })));
    
    // reset
    setTitle('');
    setDescription('');
    setStatus('lost');
    
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-full">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Tambah Laporan Baru</h3>
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
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="title">
                Judul Laporan
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={onTitleChange}
                placeholder="Contoh: Kunci Motor Beat Hitam"
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
                    name="status"
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
                    name="status"
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
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="description">
                Deskripsi Detail
              </label>
              <textarea
                id="description"
                value={description}
                onChange={onDescriptionChange}
                placeholder="Jelaskan ciri-ciri barang, lokasi kejadian, dll..."
                required
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm resize-none"
              ></textarea>
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
              disabled={isLostFoundAdd || !title || !description}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 transition-colors"
            >
              {isLostFoundAdd ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <IconDeviceFloppy size={18} />
              )}
              Simpan Laporan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
