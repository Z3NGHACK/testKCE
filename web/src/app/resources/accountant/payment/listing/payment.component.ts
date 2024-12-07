import { Component } from '@angular/core';

import { helperAnimations } from 'helper/animations';
import { Invoice } from 'app/shared/payment/payment.type';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { SharedPaymentComponent } from 'app/shared/payment/listing/payment.component';


@Component({
    selector: 'accountant-payment',
    standalone: true,
    imports: [
        SharedPaymentComponent
    ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss',
    animations: helperAnimations
})
export class PaymentComponent {

   
}

