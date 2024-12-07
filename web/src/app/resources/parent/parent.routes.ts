import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PaymentComponent } from "./payment/listing/payment.component";

export default [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'payment',
        component: PaymentComponent
    }
] as Routes;
