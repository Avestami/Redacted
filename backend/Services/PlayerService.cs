using Microsoft.EntityFrameworkCore;
using Redacted.API.Data;
using Redacted.API.Models;
using System;
using System.Threading.Tasks;

namespace Redacted.API.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly GameDbContext _context;

        public PlayerService(GameDbContext context)
        {
            _context = context;
        }

        public async Task<Player?> GetPlayerAsync(Guid playerId)
        {
            return await _context.Players
                .Include(p => p.Resources)
                .FirstOrDefaultAsync(p => p.Id == playerId);
        }

        public async Task<bool> PerformActionAsync(Guid gameId, Guid playerId, string actionTypeStr, Guid? targetId, string resourceCost)
        {
            var player = await _context.Players.FindAsync(playerId);
            if (player == null || player.GameId != gameId) return false;

            if (!Enum.TryParse<ActionType>(actionTypeStr, true, out var actionType))
            {
                return false; // Invalid action type
            }

            // Check if player has enough resources (mock logic for now)
            // In real implementation, parse resourceCost and deduct from player.Resources
            
            var action = new Redacted.API.Models.Action
            {
                GameId = gameId,
                PlayerId = playerId,
                ActionType = actionType,
                TargetId = targetId,
                ResourceCost = resourceCost,
                Success = true, // Simplified success logic
                Outcome = "{ \"message\": \"Action performed\" }"
            };

            _context.Actions.Add(action);
            player.LastActionAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
