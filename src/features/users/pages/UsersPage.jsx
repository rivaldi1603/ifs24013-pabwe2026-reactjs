import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconUsers, IconSearch, IconMail, IconCalendar } from '@tabler/icons-react';
import { asyncSetUsers } from '../states/action';
import { formatDate } from '../../../helpers/toolsHelper';

function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      dispatch(asyncSetUsers());
      setIsLoading(false);
    }
    fetchUsers();
  }, [dispatch]);

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <IconUsers className="text-blue-600" size={28} />
            <span>Daftar Pengguna</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Eksplorasi seluruh pengguna yang terdaftar pada komunitas Lost &amp; Founds
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <IconSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari pengguna"
            placeholder="Cari nama atau email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          Memuat data pengguna...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          Tidak ada pengguna yang ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-blue-300 transition"
            >
              <img
                src={
                  item.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    item.name || 'User'
                  )}&background=2563eb&color=fff`
                }
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-slate-900 truncate">
                  {item.name}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 truncate">
                  <IconMail size={14} className="shrink-0" />
                  <span className="truncate">{item.email}</span>
                </p>
                {item.created_at && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                    <IconCalendar size={14} className="shrink-0" />
                    <span>Bergabung {formatDate(item.created_at)}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersPage;