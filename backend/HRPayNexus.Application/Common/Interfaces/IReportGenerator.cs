using HRPayNexus.Domain.Entities;

namespace HRPayNexus.Application.Common.Interfaces;

public interface IReportGenerator
{
    byte[] GeneratePayrollDigestPdf(IEnumerable<PayrollRecord> records, int month, int year);
}
