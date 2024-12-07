import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { reDashboardReponse, IStudent } from 'app/resources/receptionist/dashboard/interface';
import { ReceptionistService } from 'app/resources/receptionist/receptionist.service';
import { UserPayload } from 'helper/interfaces/payload.interface';
import { env } from 'envs/env';
import { Subject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { CommonModule, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TeacherService } from '../teacher.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
    selector: 'teacher-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCalendar,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        NgClass,
        MatButtonToggleModule,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',

})
export class DashboardComponent {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    loading:boolean=false;
    data:any;
    token = inject(AuthService).accessToken;
    tokenPayload: UserPayload = jwt_decode(this.token);
    user=this.tokenPayload.user;
    fileUri=env.FILE_BASE_URL;
    level_id:any='1';
    constructor(
        private _router: Router,
        private _service: TeacherService,
    ) {}

    ngOnInit(): void {
       this.listing();
    }
    listing(){
        const params={
            level_id:this.level_id
        }
        this.loading=true;
        this._service.getDashboard(params).subscribe((res:{data:any})=>{
            this.data=res.data;
            this.loading=false
        });
    }
    toggleSingleSelectionIndicator(event:any) {
        this.level_id=event?.value;
        this.listing();

    }
    create(): void {
        this._router.navigateByUrl(`/receptionist/students/create`)
    }
    view(id:number): void {
        this._router.navigateByUrl(`teacher/class-room/view/${id}`) ;
    }
    selected: Date | null;
    schedules: Date[] = [
        new Date(2024, 5, 3),  // June 3, 2024
        new Date(2024, 5, 8),  // June 8, 2024
        new Date(2024, 5, 18), // June 18, 2024
        new Date(2024, 5, 23), // June 23, 2024
        new Date(2024, 5, 29), // June 29, 2024
        new Date(2024, 6, 30), // July 30, 2024
    ];
    dateClass = (cellDate: Date): string => {
        if (cellDate instanceof Date) {
            const highlight = this.schedules.some(dateToHighlight =>
                cellDate.getDate() === dateToHighlight.getDate() &&
                cellDate.getMonth() === dateToHighlight.getMonth() &&
                cellDate.getFullYear() === dateToHighlight.getFullYear()
            );
            return highlight ? 'custom-date-class' : '';
        }
        return '';
    };
}
