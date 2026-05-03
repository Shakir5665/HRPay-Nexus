import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Check, X, Calendar, Search, Trash2, Send } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Leaves: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Custom Modal State
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'alert', title: '', message: '' });

  const showAlert = (title: string, message: string) => {
    setModal({ show: true, type: 'alert', title, message });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModal({ show: true, type: 'confirm', title, message, onConfirm });
  };

  const { data: leaves, isLoading } = useQuery({
    queryKey: ['leaves'],
    queryFn: async () => {
      const response = await api.get('/leave');
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, comment }: any) => api.put(`/leave/${id}/status`, { status, adminComment: comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      showAlert('Success', 'Leave status updated successfully');
    },
    onError: (err: any) => showAlert('Update Failed', err.response?.data || err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/leave/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      showAlert('Deleted', 'Leave record has been removed');
    },
    onError: (err: any) => showAlert('Delete Failed', err.response?.data || err.message)
  });

  const handleAction = (id: string, status: number) => {
    const comment = status === 1 ? 'Approved' : 'Rejected';
    updateStatusMutation.mutate({ id, status, comment });
  };

  const handleDelete = (id: string) => {
    showConfirm(
      'Confirm Delete',
      'Are you sure you want to permanently delete this leave record?',
      () => deleteMutation.mutate(id)
    );
  };

  const isManagerOrAdmin = ['Admin', 'HR', 'Manager'].includes(user?.role || '');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leave Management</h1>
          </div>
          <p className="text-slate-500 mt-1 font-medium text-sm">Track and Approve Absences</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Send className="w-4 h-4" />
          Lodge Request
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex-1 max-w-md hidden md:block" />
          <div className="relative">
            <input
              type="text"
              placeholder="Search leaves..."
              className="bg-white border border-slate-200 rounded-full px-5 py-2 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-center">Start Date</th>
                <th className="px-6 py-4 text-center">End Date</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-400 text-sm">Loading leave records...</td></tr>
              ) : leaves?.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-400 text-sm">No leave records found.</td></tr>
              ) : leaves?.map((leave: any) => (
                <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{leave.employeeName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-amber-400 text-white text-[10px] font-bold rounded-lg uppercase shadow-sm shadow-amber-400/20">
                      7 days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 3600 * 24)) + 1} day(s)
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium text-center">
                    {new Date(leave.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium text-center">
                    {new Date(leave.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium italic">
                    {leave.reason}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${leave.status === 0 ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                      leave.status === 1 ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                        'bg-red-100 text-red-600 border border-red-200'
                      }`}>
                      {leave.status === 0 ? 'Pending' : leave.status === 1 ? 'Approved' : 'Rejected'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isManagerOrAdmin && leave.status === 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(leave.id, 1)}
                          disabled={updateStatusMutation.isPending}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-sm shadow-emerald-600/20 disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(leave.id, 2)}
                          disabled={updateStatusMutation.isPending}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-md text-[10px] font-bold hover:bg-red-600 transition-all flex items-center gap-1 shadow-sm shadow-red-500/20 disabled:opacity-50"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                        <button
                          onClick={() => handleDelete(leave.id)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 border border-red-400 text-red-400 rounded-md hover:bg-red-50 text-xs disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(leave.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 border border-red-400 text-red-400 rounded-md hover:bg-red-50 text-xs opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span>Showing 1 to {leaves?.length || 0} of {leaves?.length || 0} entries</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white transition-colors disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      {modal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${modal.type === 'alert' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                {modal.type === 'alert' ? <Send className="w-8 h-8" /> : <Trash2 className="w-8 h-8" />}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{modal.title}</h3>
                <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">{modal.message}</p>
              </div>
              <div className="pt-4 flex gap-3">
                {modal.type === 'confirm' && (
                  <button
                    onClick={() => setModal({ ...modal, show: false })}
                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold transition-all text-sm"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => {
                    if (modal.type === 'confirm' && modal.onConfirm) modal.onConfirm();
                    setModal({ ...modal, show: false });
                  }}
                  className={`flex-1 px-6 py-3 text-white rounded-full font-bold shadow-lg transition-all text-sm ${modal.type === 'confirm' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}
                >
                  {modal.type === 'confirm' ? 'Delete' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRequestModal && (
        <RequestLeaveModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['leaves'] })}
          showAlert={showAlert}
        />
      )}
    </div>
  );
};

const RequestLeaveModal: React.FC<{ onClose: () => void, onSuccess: () => void, showAlert: (title: string, message: string) => void }> = ({ onClose, onSuccess, showAlert }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/leave', data),
    onSuccess: () => {
      onSuccess();
      onClose();
      setFormData({ startDate: '', endDate: '', reason: '' });
      showAlert('Request Sent', 'Your leave request has been submitted successfully and is awaiting review.');
    },
    onError: (err: any) => {
      console.error('Leave request error:', err);
      const errorMessage = err.response?.data || err.message || 'Failed to submit request';
      showAlert('Submission Failed', errorMessage);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      showAlert('Validation Error', 'Please select both start and end dates.');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      showAlert('Invalid Dates', 'The start date cannot be later than the end date.');
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Lodge Leave Request</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</label>
              <input
                type="date" required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Date</label>
              <input
                type="date" required
                min={formData.startDate}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Absence</label>
            <textarea
              required rows={4}
              placeholder="Provide a brief reason for your leave request..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold transition-all text-sm">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm">
              {mutation.isPending ? 'Processing...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Leaves;
