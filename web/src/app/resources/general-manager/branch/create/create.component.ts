import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { env } from 'envs/env';
import { Branch, BranchCreateRequest } from '../branch.type';
import { BranchService } from '../branch.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';

@Component({
    selector: 'master-system-create',
    standalone: true,
    imports: [
        MatIconModule,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,

    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
})
export class CreateBranchComponent {
    
    public createForm: FormGroup;
    fileUrl: string = env.FILE_BASE_URL;
    constructor(
        public dialogRef: MatDialogRef<CreateBranchComponent>,
    
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _branchService: BranchService,
        private _snackBarService: SnackbarService
    ) {
        this.createForm = this._formBuilder.group({
            name: ['', [Validators.required]],
            address: ['', [Validators.required]], 
            code: ['', [Validators.required , this.twoCapitalLettersValidator()]], 
        });
    }

        
        

      
    // Custom Validator to check if the input is exactly two capital letters
    twoCapitalLettersValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const isValid = /^[A-Z]{2}$/.test(value); // Regex to check exactly two uppercase letters
        return isValid ? null : { twoCapitalLetters: true };
        };
    }

    get code() {
        return this.createForm.get('code');
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    submitForm(): void {
        if (this.createForm.valid) {  
            const formData: BranchCreateRequest = {
                school_id: 1, 
                name: this.createForm.get('name')?.value,
                address: this.createForm.get('address')?.value,
                code: this.createForm.get('code')?.value,
            };

            this._branchService.createBranch(formData).subscribe({
                next: res => {
                   this.dialogRef.close();
                   this._snackBarService.openSnackBar("ការបង្កើតដោយជោគជ័យ", GlobalConstants.success);

                },
                error: err => {
                    // this.isLoading = false;
                    this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
                }
            });
        }
    }

    
}
