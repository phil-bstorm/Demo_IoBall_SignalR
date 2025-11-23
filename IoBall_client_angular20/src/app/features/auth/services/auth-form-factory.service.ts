import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class AuthFormFactoryService {
    private readonly _fb = inject(FormBuilder);

    public createLoginForm() {
        const usernameControl = this._fb.control('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
        ]);

        const fg = this._fb.group({
            username: usernameControl,
        });

        return {
            controllers: { username: usernameControl },
            form: fg,
        };
    }
}
