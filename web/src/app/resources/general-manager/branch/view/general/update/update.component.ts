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
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { BranchService } from '../../../branch.service';
import { BranchCreateRequest } from '../../../branch.type';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'master-system-update',
    standalone: true,
    imports: [
        MatIconModule,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
    ],
    templateUrl: './update.component.html',
    styleUrl: './update.component.scss'
})
export class UpdateBranchComponent {
    
    public createForm: FormGroup;
    fileUrl: string = env.FILE_BASE_URL;

    public statuses: any

    constructor(
        public dialogRef: MatDialogRef<UpdateBranchComponent>,
        // @Inject(MAT_DIALOG_DATA) public datas: { row: View['general'], id: number },
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _branchService: BranchService,
        private _snackBarService: SnackbarService
    ) {
        this.createForm = this._formBuilder.group({
            name: ['', [Validators.required]],
            address: ['', [Validators.required]], 
            code: ['', [Validators.required , this.twoCapitalLettersValidator()]],
            status_id: ['' , [Validators.required]]
        });

        this.getSetup();
    }
 
    ngOnInit(): void {
        
        this.createForm.patchValue({
            name: this.data?.name || '',
            address: this.data?.address || '',
            code: this.data?.code || '',
            status_id : this.data?.status_id || '' ,
        });
        
    }

    get code() {
        return this.createForm.get('code');
    }

    twoCapitalLettersValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const isValid = /^[A-Z]{2}$/.test(value); // Regex to check exactly two uppercase letters
        return isValid ? null : { twoCapitalLetters: true };
        };
    }
     
    getSetup(): void {
        
        this._branchService.getStatusSetup().subscribe({
            next: res => {
              
                this.statuses = res.data;
            //  this._snackBarService.openSnackBar("ការបង្កើតដោយជោគជ័យ", GlobalConstants.success);

            },
            error: err => {
                // this.isLoading = false;
                this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    
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
                status_id: this.createForm.get('status_id')?.value,
            };

            this._branchService.updateBranch(formData , this.data.id ).subscribe({
                next: res => {
                   this.dialogRef.close();
                   this._snackBarService.openSnackBar("ការកែប្រែទទួលបានជោគជ័យ", GlobalConstants.success);

                },
                error: err => {
                    // this.isLoading = false;
                    this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
                }
            });
        }
    }

    
}
