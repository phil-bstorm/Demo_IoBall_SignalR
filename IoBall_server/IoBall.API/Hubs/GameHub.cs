using IoBall.API.Extensions;
using IoBall.API.Hubs.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace IoBall.API.Hubs
{
    public class GameHub : Hub<IGameHub>
    {
        [Authorize]
        public override async Task OnConnectedAsync()
        {
            string id = Context.User!.GetId();
            string username = Context.User!.GetUsername();
            Console.WriteLine($"Client connected {id} :D");

            await base.OnConnectedAsync();

            // notify all clients that a new player has connected
            await Clients.Others.PlayerJoined(id, username);
        }

        [Authorize]
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client disconnected :(");

            await base.OnDisconnectedAsync(exception);
        }

        [Authorize]
        public async Task SendChatMessage(string message)
        {
            Console.WriteLine("Received message: " + message);
            await Clients.All.ReceiveChatMessage(Context.User!.GetUsername(), message);
        }
    }
}
