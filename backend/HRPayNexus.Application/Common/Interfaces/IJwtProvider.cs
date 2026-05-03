using HRPayNexus.Domain.Entities;

namespace HRPayNexus.Application.Common.Interfaces;

public interface IJwtProvider
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}
