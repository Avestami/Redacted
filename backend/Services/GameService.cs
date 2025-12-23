using Microsoft.EntityFrameworkCore;
using Redacted.API.Data;
using Redacted.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Redacted.API.Services
{
    public class GameService : IGameService
    {
        private readonly GameDbContext _context;

        public GameService(GameDbContext context)
        {
            _context = context;
        }

        public async Task<Game> CreateGameAsync(Guid hostId, int playerCount, int phaseDuration)
        {
            var game = new Game
            {
                HostId = hostId,
                MaxPlayers = playerCount,
                PhaseDurationMinutes = phaseDuration,
                RoomCode = GenerateRoomCode()
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();
            return game;
        }

        public async Task<Game?> GetGameAsync(string roomCode)
        {
            return await _context.Games
                .Include(g => g.Players)
                .FirstOrDefaultAsync(g => g.RoomCode == roomCode);
        }

        public async Task<Game?> GetGameByIdAsync(Guid gameId)
        {
            return await _context.Games
                .Include(g => g.Players)
                .Include(g => g.Resources)
                .FirstOrDefaultAsync(g => g.Id == gameId);
        }

        public async Task<Player> JoinGameAsync(string roomCode, string userId)
        {
            var game = await GetGameAsync(roomCode);
            if (game == null)
            {
                throw new Exception("Game not found");
            }

            if (game.Players.Count >= game.MaxPlayers)
            {
                throw new Exception("Game is full");
            }

            if (game.Status != "waiting")
            {
                throw new Exception("Game has already started");
            }

            var player = new Player
            {
                GameId = game.Id,
                UserId = userId,
                // Roles and Factions will be assigned when game starts
            };

            _context.Players.Add(player);
            
            // Initialize resources for the player
            var resource = new Resource
            {
                PlayerId = player.Id,
                Battery = 100,
                Capital = 50
            };
            _context.Resources.Add(resource);

            await _context.SaveChangesAsync();
            return player;
        }

        public async Task<bool> StartGameAsync(Guid gameId)
        {
            var game = await _context.Games.Include(g => g.Players).FirstOrDefaultAsync(g => g.Id == gameId);
            if (game == null || game.Status != "waiting") return false;

            // Assign roles logic here (simplified for MVP)
            var random = new Random();
            var players = game.Players.ToList();
            int mafiaCount = players.Count / 3; // Approx 1/3 mafia

            var shuffledPlayers = players.OrderBy(x => random.Next()).ToList();
            
            for (int i = 0; i < shuffledPlayers.Count; i++)
            {
                var player = shuffledPlayers[i];
                if (i < mafiaCount)
                {
                    player.Faction = $"mafia{i % 3 + 1}"; // Distribute among 3 mafias
                    player.Role = "hacker"; // Default role for now
                }
                else
                {
                    player.Faction = "citizen";
                    player.Role = "unemployed"; // Default role
                }
            }

            game.Status = "act1";
            game.CurrentPhase = "act1";
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Game>> GetActiveGamesAsync()
        {
            return await _context.Games
                .Where(g => g.Status == "waiting")
                .ToListAsync();
        }

        private string GenerateRoomCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
