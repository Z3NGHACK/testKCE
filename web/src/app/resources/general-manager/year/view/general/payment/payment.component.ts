import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AcademicService } from '../../../academic.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule, MatTabContent } from '@angular/material/tabs';


@Component({
    selector: 'payment-setting',
    standalone: true,
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        MatTabsModule,
        MatTabContent,
    ],
})
export class GMPaymentSettingDialog {
    loading: boolean = true;
    tabs = [];
    constructor(
        public dialogRef: MatDialogRef<GMPaymentSettingDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBarService: SnackbarService,
        private _service: AcademicService,
    ) {

    }
    ngOnInit(): void {
        console.log(this.data)
        this.loading = true;
        this._service.payment(this.data.id, this.data.item.branch_id).subscribe((res: any) => {
            this.tabs = res.data;
            this.loading = false;
        })
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
