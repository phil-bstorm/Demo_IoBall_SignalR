import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private readonly _authService = inject(AuthService);

    connection: signalR.HubConnection | null = null;

    // --- SIGNALS ---
    isConnected = signal(false);

    /** Dernier joueur rejoint */
    playerJoined = signal<{ userId: string; userName: string } | null>(null);

    /** Liste complète des joueurs connectés */
    players = signal<{ userId: string; userName: string }[]>([]);

    /** Dernier mouvement reçu */
    playerMoved = signal<{ userId: string; x: number; y: number } | null>(null);

    /** Historique complet du chat */
    chatHistory = signal<{ from: string; message: string }[]>([]);

    // --- CONNEXION ---

    public async connect(): Promise<void> {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7282/gamehub', {
                accessTokenFactory: () => this._authService.token() || '',
            })
            .withAutomaticReconnect()
            .build();

        this.listenEvents();

        await this.connection.start();
        this.isConnected.set(true);
        console.log('SignalR connected');
    }

    // --- ÉCOUTE DES ÉVÉNEMENTS SIGNALR ---

    private listenEvents(): void {
        if (!this.connection) return;

        /** 1) PlayerJoined */
        this.connection.on(
            'PlayerJoined',
            (userId: string, userName: string) => {
                this.playerJoined.set({ userId, userName });

                // Met à jour la liste
                this.players.update((list) => [...list, { userId, userName }]);
                this.chatHistory.update((history) => [
                    { from: 'System', message: `${userName} join the chat.` },
                    ...history,
                ]);
            },
        );

        /** 2) ReceiveChatMessage */
        this.connection.on(
            'ReceiveChatMessage',
            (from: string, message: string) => {
                const evt = { from, message };

                this.chatHistory.update((history) => [evt, ...history]);
            },
        );

        /** 3) PlayerMoved */
        this.connection.on(
            'PlayerMoved',
            (userId: string, x: number, y: number) => {
                this.playerMoved.set({ userId, x, y });
            },
        );
    }

    // --- COMMANDES ---

    public sendMove(x: number, y: number): void {
        this.connection?.invoke('Move', x, y);
    }

    public sendChatMessage(message: string): void {
        this.connection?.invoke('SendChatMessage', message);
    }

    public async disconnect(): Promise<void> {
        if (!this.connection) return;
        await this.connection.stop();
        this.isConnected.set(false);
    }
}
