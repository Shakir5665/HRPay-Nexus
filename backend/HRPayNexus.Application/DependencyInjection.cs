using System.Reflection;
using FluentValidation;
using HRPayNexus.Application.Common.Interfaces;
using HRPayNexus.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HRPayNexus.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        
        services.AddScoped<IPayrollService, PayrollService>();

        return services;
    }
}
