namespace ApiOos.Services;

using System.Net.Http.Json;
using System.Text.Json;
using ApiOos.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public class SentraCxService : ISentraCxService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<SentraCxService> _logger;

    public SentraCxService(
        IHttpClientFactory httpClientFactory,
        ILogger<SentraCxService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<string> CreateSupportTicketAsync(Guid userId, string userName, string userEmail)
    {
        var client = _httpClientFactory.CreateClient("SentraCX");

        // 1. Ensure customer profile is registered in SentraCX via customer-signup webhook
        try
        {
            var nameParts = userName.Split(' ', 2);
            var firstName = nameParts.Length > 0 ? nameParts[0] : userName;
            var lastName = nameParts.Length > 1 ? nameParts[1] : "";

            var signupBody = new
            {
                email = userEmail,
                firstName = firstName,
                lastName = lastName
            };
            await client.PostAsJsonAsync("/api/v1/webhooks/customer-signup", signupBody);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to trigger SentraCX customer signup webhook (may already exist).");
        }

        // 2. Create ticket in SentraCX
        var ticketBody = new
        {
            title = $"Support Chat - {userName}",
            description = $"Live chat session initiated by {userName} ({userEmail})"
        };

        var response = await client.PostAsJsonAsync($"/api/v1/tickets?customerId={userId}", ticketBody);
        response.EnsureSuccessStatusCode();

        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        if (doc.RootElement.TryGetProperty("id", out var idProp))
        {
            return idProp.GetString() ?? idProp.GetGuid().ToString();
        }

        throw new InvalidOperationException("Failed to extract ticket ID from SentraCX API response.");
    }
}
