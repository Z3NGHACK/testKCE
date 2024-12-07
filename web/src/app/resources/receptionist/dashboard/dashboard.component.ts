import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ReceptionistService } from '../receptionist.service';
import { IStudent, reDashboardReponse } from './interface';
import { CommonModule, NgClass } from '@angular/common';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'app/core/auth/auth.service';
import { UserPayload } from 'helper/interfaces/payload.interface';
import { env } from 'envs/env';
import { Subject } from 'rxjs';
@Component({
    selector: 'receptionist-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        NgClass
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    loading:boolean=false;
    data:reDashboardReponse;
    token = inject(AuthService).accessToken;
    tokenPayload: UserPayload = jwt_decode(this.token);
    user=this.tokenPayload.user;
    fileUri=env.FILE_BASE_URL;
    constructor(
        private _router: Router,
        private _service: ReceptionistService,
    ) {}

    ngOnInit(): void {

      this.loading=true;
        this._service.getDashboard().subscribe((res:{data:reDashboardReponse})=>{
            this.data=res.data;
            this.loading=false
        });
    }

    create(): void {
        this._router.navigateByUrl(`/receptionist/students/create`)
    }
    viewStudent(item:IStudent){
        console.log()
        this._router.navigateByUrl(`/receptionist/students/view/${item.id}`)
    }


}
