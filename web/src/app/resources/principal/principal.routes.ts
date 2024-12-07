import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ClassComponent } from "./class/listing/class.component";
import { TeacherComponent } from "./teacher/listing/teacher.component";
import { StaffComponent } from "./staff/listing/staff.component";
import { YearComponent } from "./year/listing/year.component";
import { PaymentComponent } from "./payment/listing/payment.component";
import { ReportTransactionComponent } from "./report/transaction/transaction.component";
import { ReportFinanceComponent } from "./report/finance/finance.component";
import { RoomEvaluationComponent } from "./report/evaluation/evaluation.component";
import { SettingRoomComponent } from "./setting/room/room.component";
import { from } from "rxjs";
import { ViewYearComponent } from "./year/view/view.component";
import { TeacherViewComponent } from "../general-manager/teacher/view/view.component";
import { ViewTeacherPrincipleComponent } from "./teacher/view/view.component";
import { ViewClassroomPrincipleComponent } from "./class/view/view.component";
import { ViewStaffComponent } from "./staff/view/view.component";

export default [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'class',
        children: [
            {
                path: '',
                component: ClassComponent
            },
            {
                path: 'view/:id',
                component: ViewClassroomPrincipleComponent
            }
        ]
    },
    {
        path: 'teacher',
        data: {
            from: 'principal'
        },
        children: [
           {
            path: '',
            component: TeacherComponent
           },
           {
            path: 'view/:id',
            component: ViewTeacherPrincipleComponent
           }
        ]
    },
    {
        path: 'staff',
        children: [
            {
                path: '',
                component: StaffComponent
            },
            {
                path: 'view/:id',
                component: ViewStaffComponent
            }
        ]
    },
    {
        path: 'year',
        data: {
            from: 'principal'
        },
        children: [
            {
                path: '',
                component: YearComponent
            },
            {
                path: 'view/:id',
                component: ViewYearComponent
            }
        ], 
    },
    {
        path: 'payment',
        data: {
            from: 'principal'
        },
        component: PaymentComponent
    },
    {
        path: 'report',
        children: [
            {
                path: 'transaction',
                component: ReportTransactionComponent
            },
            {
                path: 'finance',
                component: ReportFinanceComponent
            },
            {
                path: 'evaluation',
                component: RoomEvaluationComponent
            }
        ]
    },
    {
        path: 'settings',
        children: [
            {
                path: 'room',
                component: SettingRoomComponent
            }
        ]
    },
] as Routes;
