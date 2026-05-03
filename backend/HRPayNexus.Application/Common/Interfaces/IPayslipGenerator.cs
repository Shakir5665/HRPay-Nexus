using HRPayNexus.Domain.Entities;

namespace HRPayNexus.Application.Common.Interfaces;

public interface IPayslipGenerator
{
    byte[] GeneratePdf(PayrollRecord record, Employee employee);
}
