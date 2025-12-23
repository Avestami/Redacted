using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.EntityFrameworkCore;
using Redacted.API.Data;
using Redacted.API.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace Redacted.API.Services
{
    public class TrustData
    {
        [LoadColumn(0)]
        public float Karma { get; set; }

        [LoadColumn(1)]
        public float ActionsPerformed { get; set; }

        [LoadColumn(2)]
        public bool IsMafia { get; set; } // Label for training
    }

    public class TrustPrediction
    {
        [ColumnName("Score")]
        public float TrustScore { get; set; }
    }

    public class AiService : IAiService
    {
        private readonly GameDbContext _context;
        private readonly MLContext _mlContext;

        public AiService(GameDbContext context)
        {
            _context = context;
            _mlContext = new MLContext(seed: 0);
        }

        public async Task<AiAnalysis> AnalyzeGameAsync(Guid gameId)
        {
            var game = await _context.Games
                .Include(g => g.Players)
                .ThenInclude(p => p.Actions)
                .FirstOrDefaultAsync(g => g.Id == gameId);

            if (game == null) return null;

            // Mock Analysis Logic for MVP
            // In a real scenario, we would load a trained model and predict based on player actions
            
            var trustScores = new System.Collections.Generic.Dictionary<string, float>();
            var patterns = new System.Collections.Generic.List<string>();

            foreach (var player in game.Players)
            {
                // Simple heuristic for MVP: Trust = Karma + (Actions count * 0.5)
                float score = player.Karma + (player.Actions.Count * 0.5f);
                
                // Normalize slightly
                score = Math.Clamp(score, 0, 100);
                
                trustScores.Add(player.UserId, score);

                if (player.Actions.Count > 5)
                {
                    patterns.Add($"High activity detected from {player.UserId}");
                }
            }

            var analysis = new AiAnalysis
            {
                GameId = gameId,
                TrustMatrix = JsonSerializer.Serialize(trustScores),
                BehavioralPatterns = JsonSerializer.Serialize(patterns),
                Predictions = JsonSerializer.Serialize(new { outcome = "uncertain", topSuspect = "unknown" }),
                Confidence = 0.75f,
                AnalyzedAt = DateTime.UtcNow
            };

            _context.AiAnalyses.Add(analysis);
            await _context.SaveChangesAsync();

            return analysis;
        }
    }
}
