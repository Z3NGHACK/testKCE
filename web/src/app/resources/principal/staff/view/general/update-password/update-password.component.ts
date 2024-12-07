import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import _moment from 'moment';
import { HttpClient } from '@angular/common/http';

import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { General } from 'app/shared/teacher/teacher.types';
import { StaffService } from '../../../staff.service';

const moment = _moment;

@Component({
    selector: 'principle-staff-update-password',
    standalone: true,
    templateUrl: './update-password.component.html',
    styleUrls: ['./update-password.component.scss'],
    imports: [
        MatIconModule,
        PortraitComponent,
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatMenuModule,
    ],
})
export class StaffUpdatePasswordComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: General;
    public path: 'principal' | 'general-manager';

    hideConfirmPassword = true;
    hidePassword = true;

    constructor(
        public dialogRef: MatDialogRef<StaffUpdatePasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: { data: General, id: number, path: 'principal' | 'general-manager' },
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private _service: StaffService,
        private _snackBarService: SnackbarService
    ) {
        this.firstFormGroup = this._formBuilder.group({
            newPassword: ['', [
                Validators.required,
                Validators.minLength(8), // Minimum length
            ]],
            confirmPassword: ['', [Validators.required]],
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.data = this.datas.data;
        this.path = this.datas.path;
        this._id = this.datas.id;
        this.src = `${this.fileUrl}${this.data?.avatar}`;
    }

    // Validator to check password complexity
    passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumeric = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
        return !valid ? { complexity: true } : null;
    }

    // Validator to check if new password and confirm password match
    passwordMatchValidator(formGroup: FormGroup) {
        const password = formGroup.get('newPassword').value;
        const confirmPassword = formGroup.get('confirmPassword').value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    toggleConfirmPasswordVisibility() {
        this.hideConfirmPassword = !this.hideConfirmPassword;
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.firstFormGroup.invalid) {
            return;
        }

        const body = this.firstFormGroup.value;

        this._service.updatePassword(this._id, body).subscribe({
            next: res => {
                this._snackBarService.openSnackBar("Password updated successfully", GlobalConstants.success);
                this.dialogRef.close(body);
            },
            error: err => {
                const message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
}