import React, { useState } from 'react';
import { FileText, CloudDownload, ChevronDown, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  const [month, setMonth] = useState('April');
  const [year, setYear] = useState('2026');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-500 rounded-lg shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Nexus Reports</h1>
          </div>
          <p className="text-slate-500 mt-1 font-medium text-sm">System Analytics and Export Center</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm max-w-2xl border-t-8 border-t-slate-800">
        <h2 className="text-xl font-black text-slate-900 mb-8">Export Monthly Payroll Digest</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Month</label>
            <div className="relative group">
              <select 
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all cursor-pointer"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Year</label>
            <div className="relative">
              <input 
                type="text" 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-[#1e293b] hover:bg-slate-800 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
          <CloudDownload className="w-4 h-4" />
          Initialise Data Stream
        </button>
      </div>
    </div>
  );
};

export default Reports;
