import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { GameService } from '@core/services/game.service';

@Component({
    selector: 'app-game-index',
    imports: [FormsModule],
    templateUrl: './game-index.html',
    styleUrl: './game-index.scss',
})
export class GameIndex {
    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);
    private readonly _gameService = inject(GameService);

    public isConnected = this._gameService.isConnected;

    public chatInput: string = '';

    // signals
    public chatHistory = this._gameService.chatHistory;

    public onLogout(): void {
        this._authService.logout();
        this._router.navigate(['/auth/login']);
    }

    public onConnectToGame(): void {
        this._gameService.connect();
    }

    public onSendChatMessage(): void {
        if (!this.chatInput.trim()) return;

        this._gameService.connection?.invoke(
            'SendChatMessage',
            this.chatInput.trim(),
        );

        this.chatInput = '';
    }
}
