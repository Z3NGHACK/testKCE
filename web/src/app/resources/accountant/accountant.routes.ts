import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PaymentComponent } from "./payment/listing/payment.component";
import { ReportComponent } from "./report/report.component";
import { SettingComponent } from "./setting/setting.component";

export default [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'payment',
        data: {
            from: 'accountant'
        },
        component: PaymentComponent
    },
    {
        path: 'report',
        component: ReportComponent
    },
    {
        path: 'setting',
        component: SettingComponent
    }
] as Routes;
