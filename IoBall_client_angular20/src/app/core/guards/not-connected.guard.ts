import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const notConnectedGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);

    if (!authService.isConnected()) {
        return true;
    }

    // redirection vers la page d'accueil
    const router = inject(Router);
    router.navigate(['/']);
    return false;
};
