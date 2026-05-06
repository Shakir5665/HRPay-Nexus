using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using HRPayNexus.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using HRPayNexus.Domain.Entities;
using System.Collections.Generic;

// This is a scratch script to check database records
public class DbChecker
{
    public static async Task CheckRecords(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        var records = await context.PayrollRecords.ToListAsync();
        Console.WriteLine($"Total Payroll Records: {records.Count}");
        
        foreach (var record in records)
        {
            Console.WriteLine($"Record: ID={record.Id}, Month={record.Month}, Year={record.Year}, EmployeeId={record.EmployeeId}");
        }
    }
}
