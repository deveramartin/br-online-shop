namespace ApiOos.Interfaces.Services;

public interface ISentraCxService
{
    Task<string> CreateSupportTicketAsync(Guid userId, string userName, string userEmail);
}
