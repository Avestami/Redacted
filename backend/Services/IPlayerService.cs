using Redacted.API.Models;
using System;
using System.Threading.Tasks;

namespace Redacted.API.Services
{
    public interface IPlayerService
    {
        Task<bool> PerformActionAsync(Guid gameId, Guid playerId, string actionType, Guid? targetId, string resourceCost);
        Task<Player?> GetPlayerAsync(Guid playerId);
    }
}
