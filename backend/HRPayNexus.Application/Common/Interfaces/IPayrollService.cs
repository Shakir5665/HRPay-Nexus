using HRPayNexus.Domain.Entities;

namespace HRPayNexus.Application.Common.Interfaces;

public interface IPayrollService
{
    Task<PayrollRecord> CalculateMonthlyPayrollAsync(Guid employeeId, int month, int year, decimal allowances = 0, decimal overtime = 0);
}
