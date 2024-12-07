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
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { Invoice, InvoiceDetail } from '../payment.type';
import { GlobalConstants } from 'helper/shared/constants';
import { HelperConfirmationDialogComponent } from 'helper/services/confirmation/dialog/dialog.component';
import { SharedPaymentService } from '../payment.service';


@Component({
    selector: 'shared-view-payment',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
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
export class SharedViewPaymentComponent {
    
    fileUrl: string = env.FILE_BASE_URL;
    private _id: number;
    public data: InvoiceDetail;
    public sharedIndex: number = 0;
    public combinedPayments: any[] = [];
    public paymentForm: FormGroup
    public kh_price: number;
    public diable = false;

    public path: 'principal' | 'general-manager' | 'accountant';
    constructor(
        public dialogRef: MatDialogRef<SharedViewPaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: { row :Invoice , path: 'principal' | 'general-manager' | 'accountant';},
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _paymentService: SharedPaymentService,
        private _snackbarService: SnackbarService,
    ) {
    }

    ngOnInit(): void {  
        this._id = this.datas?.row?.id;
        this.path = this.datas?.path;
        setTimeout(() => {
            this.view();
        });

    }

    view(): void {
        this._paymentService.view( this.path ,this._id ).subscribe({
            next: res => {
                this.data = res.data;
                console.log(this.data)
                this.kh_price = this.getTotalPriceInLocalCurrency();
            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }  
    
    
    updatePayment(): void {
        this._paymentService.update( this.path ,this._id ).subscribe({
            next: res => {
                
                this.dialogRef.close(res);
                this._snackbarService.openSnackBar("ធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ", GlobalConstants.success);
            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }    

    // indexCount(i: number): void {
    //     this.sharedIndex = i;
    // }

    getTotalPriceInLocalCurrency(): number {
        const price = parseFloat(this.data.price); // Convert price to number
        const rate = parseFloat(this.data.rate.number); // Convert rate number to number
        return price * rate;
    }
    
    getStatusClass(status: string): string {
        switch (status) {
          case 'រង់ចាំ':
            return 'text-yellow-500';
          case 'បានទូទាត់':
            return 'text-green-500';
          default:
            return 'text-gray-500';
        }
      }

    closeDialog(): void {
        this.dialogRef.close();
    }

}
