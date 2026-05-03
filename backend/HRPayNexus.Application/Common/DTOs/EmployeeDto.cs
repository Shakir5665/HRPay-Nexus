namespace HRPayNexus.Application.Common.DTOs;

public record EmployeeDto(
    Guid Id,
    Guid UserId,
    string FullName,
    string EmployeeCode,
    string Department,
    string Designation,
    decimal BaseSalary,
    DateTime JoinedDate,
    decimal AnnualLeaveBalance,
    bool IsActive,
    string Email
);

public record CreateEmployeeRequest(
    string FullName,
    string Email,
    string Password,
    string Department,
    string Designation,
    decimal BaseSalary,
    DateTime JoinedDate,
    string Role
);

public record UpdateEmployeeRequest(
    string FullName,
    string Department,
    string Designation,
    decimal BaseSalary
);
