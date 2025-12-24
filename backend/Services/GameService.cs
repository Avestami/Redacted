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
                RoomCode = GenerateRoomCode(),
                Status = GameStatus.Waiting
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
                    .ThenInclude(p => p.Resources)
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

            if (game.Status != GameStatus.Waiting)
            {
                throw new Exception("Game has already started");
            }

            var player = new Player
            {
                GameId = game.Id,
                UserId = userId,
                Faction = FactionType.Citizen, // Default
                Role = RoleType.Unemployed // Default
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
            if (game == null || game.Status != GameStatus.Waiting) return false;

            if (game.Players.Count < 3) // Minimum 3 for testing, ideally 6
            {
                // For dev/MVP we allow 3, but warn
                // throw new Exception("Need at least 3 players");
            }

            AssignRoles(game.Players.ToList());

            game.Status = GameStatus.Act1;
            game.CurrentPhase = "Act1";
            game.ActNumber = 1;
            game.TurnNumber = 1;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Game>> GetActiveGamesAsync()
        {
            return await _context.Games
                .Where(g => g.Status == GameStatus.Waiting)
                .ToListAsync();
        }

        private void AssignRoles(List<Player> players)
        {
            var random = new Random();
            var shuffledPlayers = players.OrderBy(x => random.Next()).ToList();
            int playerCount = shuffledPlayers.Count;

            // 1/3 Mafia, rounded down, min 1 if count >= 3
            int mafiaCount = Math.Max(1, playerCount / 3);
            int citizenCount = playerCount - mafiaCount;

            // Mafias
            var mafiaPlayers = shuffledPlayers.Take(mafiaCount).ToList();
            var citizenPlayers = shuffledPlayers.Skip(mafiaCount).ToList();

            // Assign Mafia Factions and Roles
            // Available Mafia Roles
            var mafiaRoles = new List<RoleType> { RoleType.Hacker, RoleType.Analyst, RoleType.Doctor, RoleType.Intel };
            
            for (int i = 0; i < mafiaPlayers.Count; i++)
            {
                var p = mafiaPlayers[i];
                // Distribute factions: A, B, C
                int factionIndex = i % 3;
                p.Faction = factionIndex switch
                {
                    0 => FactionType.MafiaA,
                    1 => FactionType.MafiaB,
                    _ => FactionType.MafiaC
                };

                // Assign random mafia role
                p.Role = mafiaRoles[random.Next(mafiaRoles.Count)];
            }

            // Assign Citizen Roles
            var citizenRoles = new List<RoleType> 
            { 
                RoleType.Banker, RoleType.Farmer, RoleType.Cybersmith, 
                RoleType.CitizenDoctor, RoleType.WhiteHat, RoleType.Unemployed 
            };

            foreach (var p in citizenPlayers)
            {
                p.Faction = FactionType.Citizen;
                p.Role = citizenRoles[random.Next(citizenRoles.Count)];
            }
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
