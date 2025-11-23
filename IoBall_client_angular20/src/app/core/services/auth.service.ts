import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    // Injection du HttpClient
    private readonly _httpClient = inject(HttpClient);

    // signal pour savoir si l'utilisateur est connecté (calculé à partir du token)
    isConnected = computed(() => !!this.token()); // !! convertit en booléen

    // signal pour le token JWT
    private _token = signal<string | null>(null);
    token = this._token.asReadonly();

    constructor() {
        // Récupération du token dans le localStorage au démarrage
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
            this._token.set(savedToken);
        }

        effect(() => {
            const tk = this._token();
            // sauvegarde du token dans le localStorage
            if (tk) {
                localStorage.setItem('auth_token', tk);
            } else {
                localStorage.removeItem('auth_token');
            }
        });
    }

    // méthode de connexion
    async login(username: string): Promise<void> {
        const response = await firstValueFrom(
            this._httpClient.post<{
                token: string;
            }>('https://localhost:7282/Auth/login', { username }),
        );

        this._token.set(response.token);
    }

    // méthode de déconnexion
    logout(): void {
        this._token.set(null);
    }
}
