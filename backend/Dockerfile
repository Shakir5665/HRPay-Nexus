# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY ["HRPayNexus.API/HRPayNexus.API.csproj", "HRPayNexus.API/"]
COPY ["HRPayNexus.Application/HRPayNexus.Application.csproj", "HRPayNexus.Application/"]
COPY ["HRPayNexus.Domain/HRPayNexus.Domain.csproj", "HRPayNexus.Domain/"]
COPY ["HRPayNexus.Infrastructure/HRPayNexus.Infrastructure.csproj", "HRPayNexus.Infrastructure/"]

RUN dotnet restore "HRPayNexus.API/HRPayNexus.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/HRPayNexus.API"
RUN dotnet build "HRPayNexus.API.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "HRPayNexus.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port
EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "HRPayNexus.API.dll"]
