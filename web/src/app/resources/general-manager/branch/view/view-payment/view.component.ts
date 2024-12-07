// ================================================================>> Core Librar
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// ================================================================>> Third-Party Library
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

// ================================================================>> Custom Library Librarys
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { env } from 'envs/env';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { HelperConfirmationDialogComponent } from 'helper/services/confirmation/dialog/dialog.component';
import { BranchService } from '../../branch.service';
import { InvoiceDetail } from 'app/shared/payment/payment.type';
import { Invoice } from 'app/shared/payment/payment.type';

@Component({
    selector: 'branch-view-payment',
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
        MatDialogModule,
        
    ],
})
export class BranchViewPaymentComponent {
    fileUrl: string = env.FILE_BASE_URL;
    private _id: number;
    public data: InvoiceDetail;
    
    public sharedIndex: number = 0;
    public combinedPayments: any[] = [];
    
    public paymentForm: FormGroup

    public kh_price: number;

    constructor(
        public dialogRef: MatDialogRef<BranchViewPaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public id: number,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _cd: ChangeDetectorRef,
        private _paymentService: BranchService,
        private _snackbarService: SnackbarService,
    ) {
    }
    
    ngOnInit(): void {
        this._id = this.id;
        setTimeout(() => {
          this.view();
        });
      }



    view(): void {
        this._paymentService.viewPayment(this._id ).subscribe({
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
