import { Component} from '@angular/core';
import { helperAnimations } from 'helper/animations';
import { SharedPaymentComponent } from 'app/shared/payment/listing/payment.component';




@Component({
    selector: 'priciple-payment',
    standalone: true,
    imports: [
        SharedPaymentComponent,
    ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss',
    animations: helperAnimations
})
export class PaymentComponent {

}
