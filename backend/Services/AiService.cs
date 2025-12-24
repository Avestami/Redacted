using Microsoft.EntityFrameworkCore;
using Redacted.API.Data;
using Redacted.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Redacted.API.Services
{
    public class AiService : IAiService
    {
        private readonly GameDbContext _context;

        public AiService(GameDbContext context)
        {
            _context = context;
        }

        public async Task AnalyzeGameAsync(Guid gameId)
        {
            var game = await _context.Games
                .Include(g => g.Players)
                .Include(g => g.Actions)
                .FirstOrDefaultAsync(g => g.Id == gameId);

            if (game == null) return;

            // Simple Trust Algorithm
            var trustScores = new Dictionary<Guid, int>();
            foreach (var player in game.Players)
            {
                trustScores[player.Id] = 50; // Base trust
            }

            foreach (var action in game.Actions)
            {
                if (!trustScores.ContainsKey(action.PlayerId)) continue;

                switch (action.ActionType)
                {
                    case ActionType.Hack:
                    case ActionType.Sabotage:
                        trustScores[action.PlayerId] -= 10;
                        break;
                    case ActionType.Work:
                    case ActionType.Heal:
                    case ActionType.Protect:
                        trustScores[action.PlayerId] += 5;
                        break;
                    case ActionType.Analyze:
                    case ActionType.GatherIntel:
                        // Neutral or context dependent
                        break;
                }
            }

            // Normalize 0-100
            foreach (var key in trustScores.Keys.ToList())
            {
                trustScores[key] = Math.Clamp(trustScores[key], 0, 100);
            }

            var analysis = new AiAnalysis
            {
                GameId = gameId,
                TrustMatrix = JsonSerializer.Serialize(trustScores),
                Predictions = JsonSerializer.Serialize(new { status = "Monitoring", threatLevel = "Low" }),
                Confidence = 0.85f,
                TrainingDataSize = game.Actions.Count,
                AnalyzedAt = DateTime.UtcNow
            };

            _context.AiAnalyses.Add(analysis);
            await _context.SaveChangesAsync();
        }

        public async Task<AiAnalysis?> GetLatestAnalysisAsync(Guid gameId)
        {
            return await _context.AiAnalyses
                .Where(a => a.GameId == gameId)
                .OrderByDescending(a => a.AnalyzedAt)
                .FirstOrDefaultAsync();
        }
    }
}
