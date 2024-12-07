import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportComponent } from "./report/report.component";
import { ListStudentComponent } from "./student/listing/student.component";
import { roleResolver } from "app/core/auth/resolvers/role.resolver";
import { RoleEnum } from "helper/enums/role.enum";
import { from } from "rxjs";
import { CreateComponent } from "./student/create/create.component";
import { ViewStudentComponent } from "./student/view/view.component";

export default [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'students',
        data: {
            from: 'receptionist'
        },
        children: [
            {
                path: 'listing',
                component: ListStudentComponent
            },
            {
                path: 'create',
                component: CreateComponent
            },
            {
                path: 'view/:id',
                component: ViewStudentComponent
            }
        ]
    },

    {
        path: 'report',
        component: ReportComponent
    }
] as Routes;