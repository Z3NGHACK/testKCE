import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { helperAnimations } from 'helper/animations';
import { HelperAlertComponent, HelperAlertType } from 'helper/components/alert';

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: helperAnimations,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        LanguagesComponent,
        CommonModule,
        RouterOutlet,
        NgOptimizedImage
        
    ],
})
export class AuthComponent {
    // @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: HelperAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    isLoading: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------


}
