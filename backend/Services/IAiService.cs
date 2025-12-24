using Redacted.API.Models;
using System;
using System.Threading.Tasks;

namespace Redacted.API.Services
{
    public interface IAiService
    {
        Task AnalyzeGameAsync(Guid gameId);
        Task<AiAnalysis?> GetLatestAnalysisAsync(Guid gameId);
    }
}
