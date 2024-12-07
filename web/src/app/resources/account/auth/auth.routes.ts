import { Routes } from '@angular/router';
import { AuthComponent } from 'app/resources/account/auth/auth.component';
import { AuthSignInComponent } from './sign-in/component';
import { VerifyOTPAndPasswordComponent } from './otp/otp.component';

export default [
    { path: '', pathMatch: 'full', redirectTo: '' },
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path     : 'sign-in',
                children: [
                    { 
                        path     : '', 
                        component: AuthSignInComponent
                    },
                    {
                        path     : 'verify',
                        component: VerifyOTPAndPasswordComponent,
                    },
                ]
            },
        ]
    },
] as Routes;
