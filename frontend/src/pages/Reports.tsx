import React, { useState } from 'react';
import { FileText, CloudDownload, ChevronDown, Calendar, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Reports: React.FC = () => {
  const [month, setMonth] = useState('April');
  const [year, setYear] = useState('2026');
  const [isDownloading, setIsDownloading] = useState(false);

  const [modal, setModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, title: '', message: '', type: 'error' });

  const monthMap: Record<string, number> = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
    'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' = 'error') => {
    setModal({ show: true, title, message, type });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const monthNum = monthMap[month];
      const response = await api.get(`/payroll/report/${monthNum}/${year}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payroll_Digest_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      console.error('Download failed:', error);
      let errorMessage = 'Failed to generate report. Ensure payroll for this period has been processed.';
      
      if (error.response?.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          try {
            const json = JSON.parse(text);
            showAlert('Report Error', json.message || errorMessage, 'error');
          } catch {
            showAlert('System Notice', text || errorMessage, 'error');
          }
        };
        reader.readAsText(error.response.data);
      } else {
        showAlert('Network Error', errorMessage, 'error');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1e293b] rounded-2xl shadow-xl shadow-slate-900/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Nexus Analytics</h1>
              <p className="text-slate-500 font-medium text-xs sm:text-sm">Systemic Digest Generation Node</p>
            </div>
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block bg-slate-100 px-4 py-2 rounded-full">
            Analytical Node: Active
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

        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full py-4 bg-[#1e293b] hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CloudDownload className="w-4 h-4" />
          )}
          {isDownloading ? 'Processing...' : 'Initialise Data Stream'}
        </button>
      </div>

      <AnimatePresence>
        {modal.show && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden p-10 text-center space-y-6"
            >
              <div className={`mx-auto w-16 h-16 rounded-3xl flex items-center justify-center ${modal.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {modal.type === 'error' ? <AlertCircle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{modal.title}</h3>
                <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">{modal.message}</p>
              </div>
              <button 
                onClick={() => setModal({ ...modal, show: false })}
                className={`w-full px-6 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] ${
                  modal.type === 'error' 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                }`}
              >
                Acknowledge
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
