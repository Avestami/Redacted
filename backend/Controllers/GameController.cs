using Microsoft.AspNetCore.Mvc;
using Redacted.API.Models;
using Redacted.API.Services;
using System;
using System.Threading.Tasks;

namespace Redacted.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IAiService _aiService;

        public GameController(IGameService gameService, IAiService aiService)
        {
            _gameService = gameService;
            _aiService = aiService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameRequest request)
        {
            try
            {
                if (!Guid.TryParse(request.HostId, out var hostGuid))
                {
                    // For testing, if not a guid, generate one
                    hostGuid = Guid.NewGuid();
                }

                var game = await _gameService.CreateGameAsync(hostGuid, request.PlayerCount, request.PhaseDuration);
                return Ok(new { gameId = game.Id, roomCode = game.RoomCode, status = game.Status.ToString() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("join")]
        public async Task<IActionResult> JoinGame([FromBody] JoinGameRequest request)
        {
            try
            {
                var player = await _gameService.JoinGameAsync(request.RoomCode, request.UserId);
                return Ok(new { playerId = player.Id, gameId = player.GameId, faction = player.Faction.ToString(), role = player.Role.ToString() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveGames()
        {
            var games = await _gameService.GetActiveGamesAsync();
            return Ok(games);
        }

        [HttpGet("{gameId}")]
        public async Task<IActionResult> GetGame(Guid gameId)
        {
            var game = await _gameService.GetGameByIdAsync(gameId);
            if (game == null) return NotFound();
            return Ok(game);
        }

        [HttpPost("{gameId}/start")]
        public async Task<IActionResult> StartGame(Guid gameId)
        {
            try
            {
                var success = await _gameService.StartGameAsync(gameId);
                if (!success) return BadRequest("Could not start game");
                return Ok(new { message = "Game started" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{gameId}/analysis")]
        public async Task<IActionResult> GetAiAnalysis(Guid gameId)
        {
            var analysis = await _aiService.GetLatestAnalysisAsync(gameId);
            if (analysis == null) return NotFound("No analysis available yet");
            return Ok(analysis);
        }
        
        [HttpPost("{gameId}/analyze")]
        public async Task<IActionResult> TriggerAnalysis(Guid gameId)
        {
            await _aiService.AnalyzeGameAsync(gameId);
            return Ok(new { message = "Analysis completed" });
        }
    }

    public class CreateGameRequest
    {
        public int PlayerCount { get; set; } = 8;
        public int PhaseDuration { get; set; } = 10;
        public string HostId { get; set; } = string.Empty;
    }

    public class JoinGameRequest
    {
        public string RoomCode { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
    }
}
