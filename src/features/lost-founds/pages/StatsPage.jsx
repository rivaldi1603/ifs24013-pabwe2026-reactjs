import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetLostFoundStats } from '../states/action';
import { IconChartBar, IconCalendarEvent, IconCalendarTime } from '@tabler/icons-react';

function StatsPage() {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.lostFoundStats);

  useEffect(() => {
    dispatch(asyncSetLostFoundStats());
  }, [dispatch]);

  // Helper to render stats cards gracefully whether it's an object or array
  const renderStatsCards = (data, title, icon) => {
    if (!data) {
      return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-500">
          Memuat data {title}...
        </div>
      );
    }

    // If API returns an array of data points
    if (Array.isArray(data)) {
      return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              {icon}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          </div>
          
          {data.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Belum ada data {title.toLowerCase()}.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs uppercase bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Tanggal / Periode</th>
                    <th className="px-4 py-3">Kehilangan</th>
                    <th className="px-4 py-3">Ditemukan</th>
                    <th className="px-4 py-3 rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {item.date || item.month || item.period || `Periode ${index + 1}`}
                      </td>
                      <td className="px-4 py-3 text-red-600 font-semibold">{item.lost || item.total_lost || 0}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{item.found || item.total_found || 0}</td>
                      <td className="px-4 py-3 font-bold">{item.total || (item.lost || 0) + (item.found || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    // Fallback if data is just an object or raw JSON
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        <pre className="bg-slate-50 p-4 rounded-lg overflow-x-auto text-xs text-slate-700">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Statistik Laporan</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau tren laporan kehilangan dan penemuan barang.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderStatsCards(stats?.daily, 'Statistik Harian', <IconCalendarEvent size={24} />)}
        {renderStatsCards(stats?.monthly, 'Statistik Bulanan', <IconCalendarTime size={24} />)}
      </div>
    </div>
  );
}

export default StatsPage;
