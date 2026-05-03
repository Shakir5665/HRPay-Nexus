import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { CreditCard, Info, Calculator as CalcIcon, PlusCircle, CheckCircle } from 'lucide-react';

const Payroll: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  
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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg shadow-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Ops</h1>
          </div>
          <p className="text-slate-500 mt-1 font-medium text-sm">Manage employee compensation and generate payslips</p>
        </div>
        {!calculationResult && (
          <button 
            onClick={() => setShowCalcModal(true)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Calculate Payroll
          </button>
        )}
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
                <div className="p-10 space-y-10">
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Earnings</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Base Salary</span>
                          <span className="text-sm font-black text-slate-900">LKR {calculationResult.baseSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Allowances</span>
                          <span className="text-sm font-bold text-emerald-600">+ LKR {calculationResult.allowances.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Overtime</span>
                          <span className="text-sm font-bold text-emerald-600">+ LKR {calculationResult.overtime.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Deductions</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">EPF (Employee - 8%)</span>
                          <span className="text-sm font-bold text-red-500">- LKR {calculationResult.epfEmployee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500 text-xs italic">Employer EPF (12%)</span>
                          <span className="text-sm font-medium text-slate-400 text-xs">LKR {calculationResult.epfEmployer.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500 text-xs italic">Employer ETF (3%)</span>
                          <span className="text-sm font-medium text-slate-400 text-xs">LKR {calculationResult.etfEmployer.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-lg p-6 text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Gross Salary</span>
                      <span className="text-2xl font-black text-slate-900 underline decoration-slate-200 underline-offset-8">LKR {calculationResult.grossSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-6 text-center border border-emerald-100">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Net Salary (Take Home)</span>
                      <span className="text-2xl font-black text-emerald-600 underline decoration-emerald-200 underline-offset-8">LKR {calculationResult.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
                <h2 className="text-2xl font-black text-slate-900">Calculate Employee Payroll</h2>
                <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium">
                  Select an employee, add allowances or overtime, and generate their payslip automatically.
                </p>
              </div>
              <button 
                onClick={() => setShowCalcModal(true)}
                className="px-10 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
              >
                Start Calculation
              </button>
            </div>
          </div>

          <div className="space-y-6">
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
    allowances: 0,
    overtimeHours: 0,
    overtimeRate: 0
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
      const date = new Date();
      return api.post('/payroll/process', {
        ...data,
        month: date.getMonth() + 1,
        year: date.getFullYear()
      });
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
    mutation.mutate(formData);
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
              type="number"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overtime Hours</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                value={formData.overtimeHours}
                onChange={(e) => setFormData({ ...formData, overtimeHours: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hourly Rate (OT)</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                value={formData.overtimeRate}
                onChange={(e) => setFormData({ ...formData, overtimeRate: parseFloat(e.target.value) || 0 })}
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

export default Payroll;
