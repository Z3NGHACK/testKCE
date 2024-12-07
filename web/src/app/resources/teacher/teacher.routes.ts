import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ClassRoomComponent } from "./class-room/listing/class-room.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { ReportComponent } from "./report/report.component";
import { ClassRoomViewComponent } from "./class-room/view/view.component";

export default [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'class-room',
        data: {
            from: 'teacher'
        },
        children: [
            {
                path: '',
                component: ClassRoomComponent
            },
            {
                path: 'view/:id',
                component: ClassRoomViewComponent
            }
        ]
    },
    {
        path: 'schedule',
        component: ScheduleComponent
    },
    {
        path: 'report',
        component: ReportComponent
    }
] as Routes;
