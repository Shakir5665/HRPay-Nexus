using HRPayNexus.Application.Common.Interfaces;
using HRPayNexus.Domain.Entities;
using HRPayNexus.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HRPayNexus.Application.Services;

public class PayrollService : IPayrollService
{
    private readonly IApplicationDbContext _context;

    public PayrollService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PayrollRecord> CalculateMonthlyPayrollAsync(Guid employeeId, int month, int year, decimal allowances = 0, decimal overtime = 0)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId)
            ?? throw new Exception("Employee not found");

        var startOfMonth = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

        var leaveDays = await _context.LeaveRequests
            .Where(l => l.EmployeeId == employeeId && l.Status == LeaveStatus.Approved && l.StartDate <= endOfMonth && l.EndDate >= startOfMonth)
            .ToListAsync();

        int totalUnpaidDays = 0;
        foreach (var leave in leaveDays)
        {
            // Logic to calculate days in current month
            var actualStart = leave.StartDate < startOfMonth ? startOfMonth : leave.StartDate;
            var actualEnd = leave.EndDate > endOfMonth ? endOfMonth : leave.EndDate;
            
            if (leave.Reason.Contains("Unpaid", StringComparison.OrdinalIgnoreCase))
            {
                totalUnpaidDays += (actualEnd - actualStart).Days + 1;
            }
        }

        decimal dailyRate = employee.BaseSalary / 22; // Assuming 22 working days
        decimal unpaidLeaveDeduction = totalUnpaidDays * dailyRate;

        decimal grossSalary = employee.BaseSalary + allowances + overtime - unpaidLeaveDeduction;

        // Sri Lankan Statutory Compliance
        decimal epfEmployee = grossSalary * 0.08m;
        decimal epfEmployer = grossSalary * 0.12m;
        decimal etfEmployer = grossSalary * 0.03m;

        decimal netSalary = grossSalary - epfEmployee;

        return new PayrollRecord
        {
            EmployeeId = employeeId,
            Month = month,
            Year = year,
            BaseSalary = employee.BaseSalary,
            Allowances = allowances,
            Overtime = overtime,
            UnpaidLeaveDeduction = unpaidLeaveDeduction,
            GrossSalary = grossSalary,
            EPFEmployee = epfEmployee,
            EPFEmployer = epfEmployer,
            ETFEmployer = etfEmployer,
            NetSalary = netSalary,
            ProcessedAt = DateTime.UtcNow
        };
    }
}
