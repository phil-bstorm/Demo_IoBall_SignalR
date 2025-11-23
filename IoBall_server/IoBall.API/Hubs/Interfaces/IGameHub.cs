namespace IoBall.API.Hubs.Interfaces
{
    public interface IGameHub
    {
        Task PlayerConnected(string id, string username);
        Task ReceiveChatMessage(string author, string message);
    }
}
