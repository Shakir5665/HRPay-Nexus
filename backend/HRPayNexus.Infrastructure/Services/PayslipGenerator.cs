using HRPayNexus.Application.Common.Interfaces;
using HRPayNexus.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace HRPayNexus.Infrastructure.Services;

public class PayslipGenerator : IPayslipGenerator
{
    public byte[] GeneratePdf(PayrollRecord record, Employee employee)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("HR-PAY-NEXUS").FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);
                        col.Item().Text("Corporate Payroll Services").FontSize(10).Italic();
                    });

                    row.RelativeItem().AlignRight().Column(col =>
                    {
                        col.Item().Text($"Payslip - {record.Month}/{record.Year}").FontSize(16).SemiBold();
                        col.Item().Text($"Date: {record.ProcessedAt:yyyy-MM-dd}");
                    });
                });

                page.Content().PaddingVertical(10).Column(col =>
                {
                    col.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

                    col.Item().PaddingVertical(10).Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Employee Details").SemiBold();
                            c.Item().Text($"Name: {employee.FullName}");
                            c.Item().Text($"ID: {employee.EmployeeCode}");
                            c.Item().Text($"Dept: {employee.Department}");
                            c.Item().Text($"Designation: {employee.Designation}");
                        });
                    });

                    col.Item().Table(table =>
                    {
                        static IContainer CellStyle(IContainer container)
                        {
                            return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                        }

                        static IContainer DefaultCellStyle(IContainer container)
                        {
                            return container.PaddingVertical(5);
                        }

                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.ConstantColumn(100);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("Description");
                            header.Cell().Element(CellStyle).AlignRight().Text("Amount (LKR)");
                        });

                        table.Cell().Element(CellStyle).Text("Base Salary");
                        table.Cell().Element(CellStyle).AlignRight().Text($"{record.BaseSalary:N2}");

                        table.Cell().Element(CellStyle).Text("Allowances");
                        table.Cell().Element(CellStyle).AlignRight().Text($"{record.Allowances:N2}");

                        table.Cell().Element(CellStyle).Text("Overtime");
                        table.Cell().Element(CellStyle).AlignRight().Text($"{record.Overtime:N2}");

                        table.Cell().Element(CellStyle).Text("Unpaid Leave Deduction").FontColor(Colors.Red.Medium);
                        table.Cell().Element(CellStyle).AlignRight().Text($"-{record.UnpaidLeaveDeduction:N2}");

                        table.Cell().Element(DefaultCellStyle).Text("Gross Salary").SemiBold();
                        table.Cell().Element(DefaultCellStyle).AlignRight().Text($"{record.GrossSalary:N2}").SemiBold();

                        table.Cell().Element(DefaultCellStyle).Text("EPF (Employee 8%)").FontColor(Colors.Red.Medium);
                        table.Cell().Element(DefaultCellStyle).AlignRight().Text($"-{record.EPFEmployee:N2}");

                        table.Cell().Element(DefaultCellStyle).Text("Net Salary").FontSize(12).SemiBold().FontColor(Colors.Green.Medium);
                        table.Cell().Element(DefaultCellStyle).AlignRight().Text($"{record.NetSalary:N2}").FontSize(12).SemiBold();
                        
                        // Employer Contributions (Informational)
                        table.Cell().Element(DefaultCellStyle).PaddingTop(10).Text("Employer Contributions (Statutory)").Italic();
                        table.Cell().Element(DefaultCellStyle).PaddingTop(10).Text("");
                        
                        table.Cell().Element(DefaultCellStyle).Text("EPF (Employer 12%)");
                        table.Cell().Element(DefaultCellStyle).AlignRight().Text($"{record.EPFEmployer:N2}");

                        table.Cell().Element(DefaultCellStyle).Text("ETF (Employer 3%)");
                        table.Cell().Element(DefaultCellStyle).AlignRight().Text($"{record.ETFEmployer:N2}");
                    });
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }
}
