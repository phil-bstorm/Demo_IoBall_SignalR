import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AuthFormFactoryService } from '@features/auth/services/auth-form-factory.service';

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule],
    templateUrl: './login-page.html',
    styleUrl: './login-page.scss',
})
export class LoginPage {
    private readonly _aff = inject(AuthFormFactoryService);
    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);

    public loginForm: FormGroup;
    public usernameControl: FormControl;

    public isLoading: boolean = false;
    public errorMessage: string | null = null;

    constructor() {
        const { form, controllers } = this._aff.createLoginForm();
        this.loginForm = form;
        this.usernameControl = controllers.username;
    }

    public async onSubmit() {
        console.log(this.loginForm);

        if (this.loginForm.valid) {
            // Perform login
            this.isLoading = true;
            this.errorMessage = null;
            const username = this.loginForm.value.username!;
            let success = false;
            try {
                await this._authService.login(username);
                success = true;
            } catch (error) {
                console.error('Login failed', error);
                this.errorMessage = 'Login failed. Please try again.';
            } finally {
                this.isLoading = false;
            }

            // Navigate to home on success
            if (success) {
                this._router.navigate(['/']);
            }
        }
    }
}
