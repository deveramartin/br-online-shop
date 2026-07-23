namespace ApiOos.Controllers;

using ApiOos.DTOs.Requests;
using ApiOos.DTOs.Responses;
using ApiOos.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/bot")]
public class BotController : ControllerBase
{
    private readonly IAiAnalyticsService _aiAnalyticsService;

    public BotController(IAiAnalyticsService aiAnalyticsService)
    {
        _aiAnalyticsService = aiAnalyticsService;
    }

    [HttpPost("reply")]
    public async Task<ActionResult<BotReplyResponseDto>> GetReply([FromBody] BotReplyRequestDto dto)
    {
        var reply = await _aiAnalyticsService.GetBotReplyAsync(dto);
        return Ok(reply);
    }
}
