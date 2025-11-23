import { Routes } from '@angular/router';
import { GameIndex } from './features/game/pages/game-index/game-index';
import { connectedGuard } from '@core/guards/connected.guard';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { notConnectedGuard } from '@core/guards/not-connected.guard';

export const routes: Routes = [
    {
        component: GameIndex,
        path: '',
        // canActivate: [connectedGuard],
    },
    {
        component: LoginPage,
        path: 'auth/login',
        // canActivate: [notConnectedGuard],
    },
];
