import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { CreditCard, Info, Calculator as CalcIcon, PlusCircle, CheckCircle, Eye, Download, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const Payroll: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  
  // Custom Modal State
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'alert', title: '', message: '' });

  const { data: payrollHistory } = useQuery({
    queryKey: ['payroll-history'],
    queryFn: async () => {
      const response = await api.get('/payroll/history');
      return response.data;
    }
  });

  const showAlert = (title: string, message: string) => {
    setModal({ show: true, type: 'alert', title, message });
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await api.get(`/payroll/${id}`);
      setSelectedPayroll(response.data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      showAlert('Error', 'Failed to fetch payroll details');
    }
  };

  const handleDownloadPayslip = async (id: string) => {
    try {
      const response = await api.get(`/payroll/${id}/payslip`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslip_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      showAlert('Error', 'Failed to download payslip');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1e293b] rounded-2xl shadow-xl shadow-slate-900/20">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Payroll Ops</h1>
              <p className="text-slate-500 font-medium text-xs sm:text-sm">Nexus Monetary Processing Center</p>
            </div>
          </div>
        </div>
      </div>

      {calculationResult ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payroll Calculated</h2>
              <p className="text-slate-500 text-sm font-medium">Calculation complete for the selected period.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="bg-blue-600 px-8 py-4 flex items-center gap-3">
                  <CalcIcon className="w-5 h-5 text-white" />
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">Payroll Summary</h3>
                </div>
                <div className="p-6 sm:p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Earnings Registry</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-slate-600">Base Salary</span>
                          <span className="text-xs sm:text-sm font-black text-slate-900">LKR {calculationResult.baseSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-slate-600">Allowances</span>
                          <span className="text-xs sm:text-sm font-bold text-emerald-600">+ LKR {calculationResult.allowances.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-slate-600">Overtime</span>
                          <span className="text-xs sm:text-sm font-bold text-emerald-600">+ LKR {calculationResult.overtime.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Deduction Node</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-slate-600">Unpaid Leaves</span>
                          <span className="text-xs sm:text-sm font-bold text-red-500">- LKR {(calculationResult.unpaidLeaveDeduction ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-slate-600">EPF (Employee 8%)</span>
                          <span className="text-xs sm:text-sm font-bold text-red-500">- LKR {(calculationResult.epfEmployee ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center opacity-60">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Employer Contrib.</span>
                          <span className="text-[10px] font-black text-slate-400">{(calculationResult.epfEmployer + calculationResult.etfEmployer).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-8 border-t border-slate-100">
                    <div className="bg-slate-50/50 p-6 sm:p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Gross Aggregate</p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900">LKR {(calculationResult.grossSalary ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-emerald-50/50 p-6 sm:p-8 rounded-[2rem] border border-emerald-100 flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-600/5">
                      <p className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Net Payable Salary</p>
                      <p className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tighter">LKR {(calculationResult.netSalary ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-6">Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleDownloadPayslip(calculationResult.id)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/10"
                  >
                    <PlusCircle className="w-4 h-4 rotate-45" /> Generate Payslip PDF
                  </button>
                  <button 
                    onClick={() => {
                      setCalculationResult(null);
                      setShowCalcModal(true);
                    }}
                    className="w-full py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    Calculate Another
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-6">Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase">Date:</span>
                    <span className="text-slate-900">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase">Employee:</span>
                    <span className="text-slate-900 truncate max-w-[120px]">{calculationResult.employeeName}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase">Department:</span>
                    <span className="text-slate-900">{calculationResult.department}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] border-t-8 border-t-emerald-500">
              <div className="p-6 bg-emerald-50 rounded-3xl text-emerald-500">
                <CalcIcon className="w-16 h-16" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">
                  {user?.role === 'Employee' ? 'Your Payroll Records' : 'Calculate Employee Payroll'}
                </h2>
                <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium">
                  {user?.role === 'Employee' 
                    ? 'Review your monthly compensation and download your official payslips below.' 
                    : 'Select an employee, add allowances or overtime, and generate their payslip automatically.'}
                </p>
              </div>
              {user?.role !== 'Employee' && (
                <button 
                  onClick={() => setShowCalcModal(true)}
                  className="px-10 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
                >
                  Start Calculation
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-6 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-300" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {payrollHistory?.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{p.employeeName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(p.year, p.month - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleViewDetails(p.id)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDownloadPayslip(p.id)} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded"><Download className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {(!payrollHistory || payrollHistory.length === 0) && <p className="text-xs text-slate-400 italic">No history available</p>}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-6 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-300" /> How It Works
              </h3>
              <ul className="space-y-4">
                {[
                  "Select an employee",
                  "Enter allowances & overtime",
                  "Review calculations",
                  "Generate PDF payslip"
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-medium">
                    <span className="text-slate-300 font-black">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Monthly History Registry */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          Monthly Payroll Registry
        </h3>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Employee</th>
                  <th className="px-8 py-5">Period</th>
                  <th className="px-8 py-5">Net Salary</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payrollHistory?.slice(0, 10).map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-sm font-black text-slate-900 uppercase tracking-tight">{p.employeeName}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {new Date(p.year, p.month - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-emerald-600 tabular-nums">LKR {p.netSalary.toLocaleString()}.00</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest">Systemic Processed</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleViewDetails(p.id)}
                          className="p-2.5 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl border border-blue-100 transition-all shadow-lg shadow-blue-600/5 active:scale-95"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadPayslip(p.id)}
                          className="p-2.5 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl border border-emerald-100 transition-all shadow-lg shadow-emerald-600/5 active:scale-95"
                          title="Download Payslip"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!payrollHistory || payrollHistory.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 text-xs font-black uppercase tracking-[0.2em] italic">Null History Output</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden divide-y divide-slate-100">
            {payrollHistory?.slice(0, 10).map((p: any) => (
                <div key={p.id} className="p-6 space-y-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{p.employeeName}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {new Date(p.year, p.month - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleViewDetails(p.id)} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-500 transition-all"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => handleDownloadPayslip(p.id)} className="p-2 bg-slate-900 text-white rounded-xl shadow-lg"><Download className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Net Payable</p>
                            <p className="text-sm font-black text-emerald-600 tabular-nums">{p.netSalary.toLocaleString()}.00</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded text-[8px] font-black uppercase tracking-widest">Processed</span>
                    </div>
                </div>
            ))}
            {(!payrollHistory || payrollHistory.length === 0) && (
                <div className="p-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Registry Void</div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <PayrollDetailsModal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        data={selectedPayroll}
        onDownload={() => handleDownloadPayslip(selectedPayroll?.id)}
      />

      {modal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden p-8 text-center space-y-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{modal.title}</h3>
            <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">{modal.message}</p>
            <button 
              onClick={() => setModal({ ...modal, show: false })}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {showCalcModal && (
        <CalculatePayrollModal 
          onClose={() => setShowCalcModal(false)} 
          onSuccess={(result) => {
            setCalculationResult(result);
            setShowCalcModal(false);
            queryClient.invalidateQueries({ queryKey: ['payroll-history'] });
          }}
          showAlert={showAlert}
        />
      )}
    </div>
  );
};

const CalculatePayrollModal: React.FC<{ 
  onClose: () => void, 
  onSuccess: (result: any) => void,
  showAlert: (title: string, message: string) => void
}> = ({ onClose, onSuccess, showAlert }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    allowances: '' as string | number,
    overtimeHours: '' as string | number,
    overtimeRate: '' as string | number,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await api.get('/employee');
      return response.data;
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return api.post('/payroll/process', data);
    },
    onSuccess: (response) => {
      onSuccess(response.data);
    },
    onError: (err: any) => {
      showAlert('Processing Error', err.response?.data || 'Failed to calculate payroll');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      showAlert('Validation Error', 'Please select an employee.');
      return;
    }
    
    // Convert string inputs to numbers for API
    const submissionData = {
      ...formData,
      allowances: parseFloat(formData.allowances.toString()) || 0,
      overtimeHours: parseFloat(formData.overtimeHours.toString()) || 0,
      overtimeRate: parseFloat(formData.overtimeRate.toString()) || 0
    };
    
    mutation.mutate(submissionData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
            <CalcIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Calculate Payroll</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Individual Assessment</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Employee *</label>
            <select 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none appearance-none"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            >
              <option value="">-- Select Employee --</option>
              {employees?.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allowances (LKR)</label>
            <input 
              type="text"
              inputMode="decimal"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              placeholder="0"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Month</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none appearance-none"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                  <option key={m} value={m}>{new Date(2024, m-1).toLocaleString('en-US', { month: 'long' })}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Year</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-bold"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2026 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overtime Hours</label>
              <input 
                type="text"
                inputMode="decimal"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="0"
                value={formData.overtimeHours}
                onChange={(e) => setFormData({ ...formData, overtimeHours: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hourly Rate (OT)</label>
              <input 
                type="text"
                inputMode="decimal"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="0"
                value={formData.overtimeRate}
                onChange={(e) => setFormData({ ...formData, overtimeRate: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold transition-all text-sm">Cancel</button>
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="flex-1 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {mutation.isPending ? 'Processing...' : 'Calculate Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PayrollDetailsModal: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  data: any,
  onDownload: () => void 
}> = ({ isOpen, onClose, data, onDownload }) => {
  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 bg-[#0b1120] text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Payroll Report</h3>
                  <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">Period: {new Date(data.year, data.month - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8 pb-8 border-b border-slate-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Name</p>
                  <p className="text-lg font-black text-slate-900">{data.employeeName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                  <p className="text-sm font-bold text-slate-600">{data.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Leave Ledger
                  </h4>
                  <div className="space-y-3 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">Opening Balance:</span>
                      <span className="text-slate-900">{data.leaveOpeningBalance ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">Paid Leave Used:</span>
                      <span className="text-slate-900">{data.paidLeaveUsed ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">Excess (Unpaid) Leave:</span>
                      <span className="text-red-500">{data.unpaidLeaveUsed ?? 0}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center text-xs font-black">
                      <span className="text-slate-900 uppercase tracking-tight">Closing Balance:</span>
                      <span className="text-blue-600">{data.leaveClosingBalance ?? 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Salary Calculation
                  </h4>
                  <div className="space-y-3 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">Monthly Salary:</span>
                      <span className="text-slate-900">LKR {(data.baseSalary ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">Daily Rate (÷30):</span>
                      <span className="text-slate-900">LKR {((data.baseSalary ?? 0) / 30).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">Deduction ({data.unpaidLeaveUsed ?? 0} days):</span>
                      <span className="text-red-500">- LKR {(data.unpaidLeaveDeduction ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center text-xs font-black">
                      <span className="text-slate-900 uppercase tracking-tight">Net Base Payable:</span>
                      <span className="text-emerald-600">LKR {((data.baseSalary ?? 0) - (data.unpaidLeaveDeduction ?? 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Final Earnings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Net Base</span>
                      <span className="font-bold text-slate-900">LKR {((data.baseSalary ?? 0) - (data.unpaidLeaveDeduction ?? 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Allowances</span>
                      <span className="font-bold text-emerald-600">+ LKR {(data.allowances ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Overtime</span>
                      <span className="font-bold text-emerald-600">+ LKR {(data.overtime ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Statutory Deductions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">EPF (8%)</span>
                      <span className="font-bold text-red-500">- LKR {data.epfEmployee.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Pay (LKR)</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{data.netSalary.toLocaleString()}.00</p>
                </div>
                <button 
                  onClick={onDownload}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-600/20 transition-all"
                >
                  <Download className="w-4 h-4" /> Download Payslip Slip
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Payroll;
