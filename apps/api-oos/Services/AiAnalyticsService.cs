namespace ApiOos.Services;

using System.Net.Http.Json;
using System.Text.Json;
using ApiOos.DTOs.Requests;
using ApiOos.DTOs.Responses;
using ApiOos.Interfaces.Services;
using Microsoft.Extensions.Logging;

public class AiAnalyticsService : IAiAnalyticsService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AiAnalyticsService> _logger;

    public AiAnalyticsService(IHttpClientFactory httpClientFactory, ILogger<AiAnalyticsService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<BotReplyResponseDto> GetBotReplyAsync(BotReplyRequestDto dto)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("AiAnalytics");
            var body = new
            {
                ticket_id = string.IsNullOrWhiteSpace(dto.TicketId) ? Guid.NewGuid().ToString() : dto.TicketId,
                text = dto.UserMessage,
                include_messages = false,
            };

            var response = await client.PostAsJsonAsync("/api/v1/tickets/analyze-intent", body);
            if (response.IsSuccessStatusCode)
            {
                using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
                var root = doc.RootElement;

                var category = root.TryGetProperty("predicted_category", out var catProp) ? catProp.GetString() ?? "general_inquiry" : "general_inquiry";
                var reasoning = root.TryGetProperty("reasoning", out var reasonProp) ? reasonProp.GetString() ?? "" : "";
                var urgency = root.TryGetProperty("urgency_score", out var urgProp) ? urgProp.GetDouble() : 0.5;

                var replyText = !string.IsNullOrWhiteSpace(reasoning)
                    ? reasoning
                    : $"I understand your query regarding {category.Replace('_', ' ')}. Let me know if you would like to speak with a human support agent!";

                return new BotReplyResponseDto
                {
                    Reply = replyText,
                    Category = category,
                    ShouldEscalate = urgency >= 0.7,
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to call AI Analytics service for bot reply. Falling back to default assistant reply.");
        }

        // Fallback response
        return new BotReplyResponseDto
        {
            Reply = "Thank you for reaching out! I've logged your query. Would you like me to connect you to a live support representative?",
            Category = "general_inquiry",
            ShouldEscalate = true,
        };
    }
}
