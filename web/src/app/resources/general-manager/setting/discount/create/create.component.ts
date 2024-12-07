import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { DiscountService } from '../discount.service';

@Component({
    selector: 'master-discount-create',
    standalone: true,
    imports: [
        MatIconModule,
        PortraitComponent,
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
        MatButtonModule
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
})
export class CreateDiscountComponent {
    
    public createForm: FormGroup;
    fileUrl: string = env.FILE_BASE_URL;
    constructor(
        public dialogRef: MatDialogRef<CreateDiscountComponent>,
        // @Inject(MAT_DIALOG_DATA) public datas: { row: View['general'], id: number },
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _branchService: DiscountService,
        private _snackBarService: SnackbarService
    ) {
        this.createForm = this._formBuilder.group({
            percentage: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.max(100)]], 
          });
    }


    closeDialog(): void {
        this.dialogRef.close();
    }
    submitForm(): void {
        if (this.createForm.valid) {
            
            const formData: any = {
                percentage: this.createForm.get('percentage')?.value,
            };

            this._branchService.create(formData).subscribe({
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
