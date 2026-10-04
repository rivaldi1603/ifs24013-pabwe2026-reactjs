import Swal from 'sweetalert2';

function showSuccessDialog(title = 'Berhasil', text = '') {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#2563eb',
  });
}

function showErrorDialog(title = 'Terjadi Kesalahan', text = '') {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#dc2626',
  });
}

async function showConfirmDialog(
  title = 'Konfirmasi',
  text = 'Apakah Anda yakin ingin melanjutkan tindakan ini?'
) {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Lanjutkan',
    cancelButtonText: 'Batal',
  });
  return result.isConfirmed;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const toolsHelper = {
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog,
  formatDate,
};

export {
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog,
  formatDate,
};
export default toolsHelper;