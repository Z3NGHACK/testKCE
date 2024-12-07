// ================================================================>> Core Librar
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// ================================================================>> Third-Party Library
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

// ================================================================>> Custom Library Librarys
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { env } from 'envs/env';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaymentService } from '../payment.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { Invoice, InvoiceDetail } from '../payment.type';
import { GlobalConstants } from 'helper/shared/constants';


@Component({
    selector: 'accountant-confirm-payment',
    standalone: true,
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
    imports: [
        MatIconModule,
        MatDialogModule,
        MatCommonModule,
        MatTabsModule,
        MatCheckboxModule,
        CommonModule,
        MatButtonModule,

    ],
})
export class AccountantConfirmComponent {
    fileUrl: string = env.FILE_BASE_URL;
    private _id: number;
    public data: InvoiceDetail;
    
    public sharedIndex: number = 0;
    public combinedPayments: any[] = [];
    
    public paymentForm: FormGroup
    constructor(
        public dialogRef: MatDialogRef<AccountantConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public row: InvoiceDetail,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _paymentService: PaymentService,
        private _snackbarService: SnackbarService,
    ) {
    }


    
    ngOnInit(): void {  
        this.data = this.row;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

 
}
