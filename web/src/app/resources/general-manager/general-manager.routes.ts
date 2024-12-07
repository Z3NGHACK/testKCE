import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BranchComponent } from "./branch/listing/branch.component";
import { PaymentComponent } from "./payment/payment.component";
import { ListStudentComponent } from "./student/listing/student.component";
import { TeacherComponent } from "./teacher/listing/teacher.component";
import { YearComponent } from "./year/listing/year.component";
import { ReportTransactionComponent } from "./report/transaction/transaction.component";
import { ReportFinanceComponent } from "./report/finance/finance.component";
import { ReportTeacherComponent } from "./report/teacher/teacher.component";
import { SettingInfoComponent } from "./setting/info/info.component";
import { SettingSubjectComponent } from "./setting/subject/listing/subject.component";
import { SettingLevelComponent } from "./setting/level/listing/level.component";
import { SettingStepComponent } from "./setting/step/listing/step.component";
import { SettingDiscountComponent } from "./setting/discount/listing/discount.component";
import { SettingSourceComponent } from "./setting/source/listing/source.component";
import { ProgramComponent } from "./program/listing/program.component";
import { ViewStudentComponent } from "./student/view/view.component";
import { ViewComponent } from "./setting/subject/view/view.component";
import { ProgramViewComponent } from "./program/view/view.component";
import { TeacherViewComponent } from "./teacher/view/view.component";
import { YearViewComponent } from "./year/view/view.component";
import { ViewBranchComponent } from "./branch/view/view.component";


export default [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'branch',
        children: [
            {
                path: '',
                component: BranchComponent
            },
            {
                path: 'view/:id',
                component: ViewBranchComponent
            }
        ]
    },
    {
        path: 'payment',
        data: {
            from: 'general-manager'
        },
        component: PaymentComponent
    },
    {
        path: 'student',
        data: {
            from: 'general-manager'
        },
        children: [
            {
                path: '',
                component: ListStudentComponent
            },
            {
                path: 'view/:id',
                component: ViewStudentComponent
            }
        ]
    },
    {
        path: 'teacher',
        data: {
            from: 'general-manager'
        },
        children: [
            {
                path: '',
                component: TeacherComponent
            },
            {
                path: 'view/:id',
                component: TeacherViewComponent
            },
        ]  
        
    },
    {
        path: 'year',
        data: {
            from: 'general-manager'
        },
        children: [
            {
                path: '',
                component: YearComponent
            },
            {
                path: 'view/:id',
                component: YearViewComponent
            },
        ] 
        
    },
    {
        path: 'program',
        children: [
            {
                path: '',
                component: ProgramComponent
            },
            {
                path: 'view/:id',
                component: ProgramViewComponent
            },
        ]  
        
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
                path: 'teacher',
                component: ReportTeacherComponent
            }
        ]
    },
    {
        path: 'settings',
        children: [
            {
                path: 'info',
                component: SettingInfoComponent,
                children: [
                    {
                        path: 'staff/view/:id', 
                        component: ViewComponent 
                    } ]
            },
            {
                path: 'subject',
                component: SettingSubjectComponent,
                children: [
                    {
                        path: 'view/:id', 
                        component: ViewComponent 
                    } ]
            },
            {
                path: 'level',
                component: SettingLevelComponent
            },
            {
                path: 'step',
                component: SettingStepComponent
            },
            {
                path: 'discount',
                component: SettingDiscountComponent
            },
            {
                path: 'source',
                component: SettingSourceComponent
            }
        ]
    },
] as Routes;
