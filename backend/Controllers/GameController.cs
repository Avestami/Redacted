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

        public GameController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameRequest request)
        {
            try
            {
                // Assuming HostId comes from auth or request for MVP
                var game = await _gameService.CreateGameAsync(Guid.Parse(request.HostId), request.PlayerCount, request.PhaseDuration);
                return Ok(new { gameId = game.Id, roomCode = game.RoomCode, status = game.Status });
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
                return Ok(new { playerId = player.Id, gameId = player.GameId });
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
            var success = await _gameService.StartGameAsync(gameId);
            if (!success) return BadRequest("Could not start game");
            return Ok();
        }
    }

    public class CreateGameRequest
    {
        public int PlayerCount { get; set; }
        public int PhaseDuration { get; set; }
        public string HostId { get; set; }
    }

    public class JoinGameRequest
    {
        public string RoomCode { get; set; }
        public string UserId { get; set; }
    }
}
