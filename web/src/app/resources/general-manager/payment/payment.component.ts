import { Component } from '@angular/core';
import { SharedPaymentComponent } from 'app/shared/payment/listing/payment.component';

@Component({
    selector: 'general-manager-payment',
    standalone: true,
    imports: [
        SharedPaymentComponent
    ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss'
})
export class PaymentComponent {

}
