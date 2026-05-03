namespace HRPayNexus.Application.Common.DTOs;

public record PayrollProcessRequest(
    int Month, 
    int Year, 
    Guid? EmployeeId = null, 
    decimal Allowances = 0, 
    decimal OvertimeHours = 0, 
    decimal OvertimeRate = 0
);

public record PayrollSummaryDto(
    Guid Id,
    string EmployeeName,
    int Month,
    int Year,
    decimal GrossSalary,
    decimal NetSalary,
    DateTime ProcessedAt
);
