using Redacted.API.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Redacted.API.Services
{
    public interface IGameService
    {
        Task<Game> CreateGameAsync(Guid hostId, int playerCount, int phaseDuration);
        Task<Game?> GetGameAsync(string roomCode);
        Task<Game?> GetGameByIdAsync(Guid gameId);
        Task<Player> JoinGameAsync(string roomCode, string userId);
        Task<bool> StartGameAsync(Guid gameId);
        Task<IEnumerable<Game>> GetActiveGamesAsync();
    }
}
