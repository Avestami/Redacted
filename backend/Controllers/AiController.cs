using Microsoft.AspNetCore.Mvc;
using Redacted.API.Services;
using System;
using System.Threading.Tasks;

namespace Redacted.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpGet("analysis/{gameId}")]
        public async Task<IActionResult> GetAnalysis(Guid gameId)
        {
            try
            {
                var analysis = await _aiService.AnalyzeGameAsync(gameId);
                if (analysis == null) return NotFound("Game not found");
                return Ok(analysis);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
