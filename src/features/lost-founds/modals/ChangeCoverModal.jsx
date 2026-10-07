import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconX, IconUpload, IconPhoto } from '@tabler/icons-react';
import { asyncPostLostFoundCover } from '../states/action';
import { showErrorDialog } from '../../../helpers/toolsHelper';

function ChangeCoverModal({ isOpen, onClose, lostFoundId, onSuccess }) {
  const dispatch = useDispatch();
  const isLostFoundChangeCover = useSelector((state) => state.isLostFoundChangeCover);
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showErrorDialog('Format Tidak Valid', 'Silakan unggah file gambar (JPG, PNG, dll).');
      return;
    }

    // Validate file size (e.g., max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showErrorDialog('Ukuran Terlalu Besar', 'Maksimal ukuran file adalah 2MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !lostFoundId) return;

    dispatch(asyncPostLostFoundCover(lostFoundId, selectedFile));
    
    // reset
    setSelectedFile(null);
    setPreviewUrl(null);
    fileInputRef.current.value = '';

    if (onSuccess) onSuccess();
    onClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    fileInputRef.current.value = '';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-full">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Unggah Foto / Cover</h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-5 space-y-4">
            <div className="flex flex-col items-center justify-center w-full">
              <label 
                htmlFor="dropzone-file" 
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${previewUrl ? 'border-blue-500' : 'border-slate-300'}`}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full p-2">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white font-semibold flex items-center gap-2">
                        <IconUpload size={20} /> Ganti Foto
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <IconPhoto size={48} className="mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-500">
                      <span className="font-semibold text-blue-600">Klik untuk mengunggah</span> atau seret dan lepas
                    </p>
                    <p className="text-xs text-slate-400">SVG, PNG, JPG atau GIF (Maks. 2MB)</p>
                  </div>
                )}
                <input 
                  id="dropzone-file" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundChangeCover || !selectedFile}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 transition-colors"
            >
              {isLostFoundChangeCover ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <IconUpload size={18} />
              )}
              Unggah Foto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeCoverModal;
