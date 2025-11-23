namespace IoBall.API.Hubs.Interfaces
{
    public interface IGameHub
    {
        Task PlayerJoined(string id, string username);
        Task ReceiveChatMessage(string author, string message);
    }
}
