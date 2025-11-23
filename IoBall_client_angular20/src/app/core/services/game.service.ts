import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private readonly _authService = inject(AuthService);
    connection: signalR.HubConnection | null = null;
    public isConnected = signal<boolean>(false);

    public async connect(): Promise<void> {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7282/gamehub', {
                accessTokenFactory: () => this._authService.token() || '',
            })
            .build();
        this.listenEvents();
        await this.connection.start();
        this.isConnected.set(true);
    }

    public listenEvents(): void {
        if (!this.connection) return;
    }

    public async sendChatMessage(message: string): Promise<void> {
        if (!this.connection) return;
        await this.connection.invoke('SendChatMessage', message);
    }
    public async disconnect(): Promise<void> {
        if (!this.connection) return;
        this.isConnected.set(false);
        await this.connection.stop();
    }
}
