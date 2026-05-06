using HRPayNexus.Application.Common.Interfaces;
using HRPayNexus.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace HRPayNexus.Infrastructure.Services;

public class ReportGenerator : IReportGenerator
{
    public byte[] GeneratePayrollDigestPdf(IEnumerable<PayrollRecord> records, int month, int year)
    {
        var monthName = new DateTime(year, month, 1).ToString("MMMM");
        var generatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        var startDate = new DateTime(year, month, 1).ToString("yyyy-MM-01");
        var endDate = new DateTime(year, month, DateTime.DaysInMonth(year, month)).ToString("yyyy-MM-dd");

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Helvetica"));

                page.Header().Column(col =>
                {
                    col.Item().Text("PAYROLL DIGEST REPORT").FontSize(28).ExtraBold().FontColor("#2563eb");
                    col.Item().Text($"{monthName} {year}").FontSize(18).SemiBold().FontColor("#3b82f6");
                    
                    col.Item().PaddingTop(20).Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Report Generated:").Bold();
                            c.Item().Text(generatedAt);
                        });
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().AlignRight().Text("Period:").Bold();
                            c.Item().AlignRight().Text($"{startDate} to {endDate}");
                        });
                    });
                });

                page.Content().PaddingVertical(20).Column(col =>
                {
                    col.Item().PaddingTop(10).PaddingBottom(10).Text("Payroll Summary").FontSize(16).SemiBold().FontColor("#3b82f6");

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(3);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("Employee Name");
                            header.Cell().Element(CellStyle).AlignRight().Text("Gross (LKR)");
                            header.Cell().Element(CellStyle).AlignRight().Text("Deductions (LKR)");
                            header.Cell().Element(CellStyle).AlignRight().Text("Net (LKR)");

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black).DefaultTextStyle(x => x.SemiBold());
                            }
                        });

                        decimal totalGross = 0;
                        decimal totalDeductions = 0;
                        decimal totalNet = 0;

                        foreach (var record in records)
                        {
                            var deductions = record.GrossSalary - record.NetSalary;
                            totalGross += record.GrossSalary;
                            totalDeductions += deductions;
                            totalNet += record.NetSalary;

                            table.Cell().Element(RowStyle).Text(record.Employee.FullName);
                            table.Cell().Element(RowStyle).AlignRight().Text($"{record.GrossSalary:N2}");
                            table.Cell().Element(RowStyle).AlignRight().Text($"{deductions:N2}");
                            table.Cell().Element(RowStyle).AlignRight().Text($"{record.NetSalary:N2}");

                            static IContainer RowStyle(IContainer container)
                            {
                                return container.PaddingVertical(5);
                            }
                        }

                        // Total Row
                        table.Cell().Element(FooterStyle).Text("TOTAL").FontColor("#16a34a");
                        table.Cell().Element(FooterStyle).AlignRight().Text($"{totalGross:N2}").FontColor("#16a34a");
                        table.Cell().Element(FooterStyle).AlignRight().Text($"{totalDeductions:N2}").FontColor("#16a34a");
                        table.Cell().Element(FooterStyle).AlignRight().Text($"{totalNet:N2}").FontColor("#16a34a");

                        static IContainer FooterStyle(IContainer container)
                        {
                            return container.PaddingVertical(10).BorderTop(2).BorderColor("#16a34a").DefaultTextStyle(x => x.Bold());
                        }
                    });

                    col.Item().PaddingTop(30).Column(stats =>
                    {
                        stats.Item().PaddingBottom(5).Text("Report Statistics").FontSize(14).SemiBold().FontColor("#3b82f6");
                        stats.Item().Row(row =>
                        {
                            row.RelativeItem().Text(t =>
                            {
                                t.Span("Total Employees: ").Bold();
                                t.Span($"{records.Count()}");
                            });
                            row.RelativeItem().AlignRight().Text(t =>
                            {
                                t.Span("Average Salary: LKR ").Bold();
                                t.Span($"{(records.Any() ? records.Average(r => r.NetSalary) : 0):N2}");
                            });
                        });
                    });
                });

                page.Footer().PaddingBottom(20).AlignCenter().Text("HRPay Nexus v1.0 - Payroll Intelligence System").FontSize(10).Italic().FontColor(Colors.Grey.Medium);
            });
        });

        return document.GeneratePdf();
    }
}
