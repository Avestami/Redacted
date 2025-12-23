using Microsoft.AspNetCore.Mvc;
using Redacted.API.Services;
using System;
using System.Threading.Tasks;

namespace Redacted.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly IPlayerService _playerService;

        public PlayerController(IPlayerService playerService)
        {
            _playerService = playerService;
        }

        [HttpPost("action")]
        public async Task<IActionResult> PerformAction([FromBody] PerformActionRequest request)
        {
            try
            {
                var success = await _playerService.PerformActionAsync(request.GameId, request.PlayerId, request.ActionType, request.TargetId, request.ResourceCost.ToString());
                if (!success) return BadRequest("Action failed");
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{playerId}")]
        public async Task<IActionResult> GetPlayer(Guid playerId)
        {
            var player = await _playerService.GetPlayerAsync(playerId);
            if (player == null) return NotFound();
            return Ok(player);
        }
    }

    public class PerformActionRequest
    {
        public Guid GameId { get; set; }
        public Guid PlayerId { get; set; }
        public string ActionType { get; set; }
        public Guid? TargetId { get; set; }
        public object ResourceCost { get; set; }
    }
}
