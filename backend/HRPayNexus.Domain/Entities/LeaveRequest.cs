using HRPayNexus.Domain.Enums;

namespace HRPayNexus.Domain.Entities;

public class LeaveRequest
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public LeaveStatus Status { get; set; } = LeaveStatus.Pending;
    public string? AdminComment { get; set; }
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

    public Employee Employee { get; set; } = null!;
}
