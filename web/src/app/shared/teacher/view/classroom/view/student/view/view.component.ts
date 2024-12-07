import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogConfig,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { env } from 'envs/env';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Data } from '@angular/router';
import teacherRoutes from 'app/resources/teacher/teacher.routes';
import { from } from 'rxjs';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { ReceptionistService } from 'app/resources/receptionist/receptionist.service';
import { ClassroomService } from 'app/resources/principal/class/class.service';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { SharedTeacherClassroomReportDialogComponent } from '../report/report.component';
import { SharedClassroomAttendanceComponent } from '../attandance/attendance.component';
// import { PrincipleClassroomReportDialogComponent } from '../report/report.component';
// import { PrincipleClassroomAttendanceComponent } from '../classroom-attendance/classroom-attendence.component';

@Component({
    selector: 'shared-view-student-classroom-detail',
    standalone: true,
    imports: [
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
})

export class SharedClassroomDetailComponent {

    fileUrl: string = env.FILE_BASE_URL;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    path: 'principal' | 'general-manager';

    displayedColumns: string[] = ['date', 'situation', 'reason', 'action'];
    report:any={};
    loading=true;;
    constructor(
        public dialogRef: MatDialogRef<SharedClassroomDetailComponent>,
        private _matDialog: MatDialog,
        private _activatedRoute: ActivatedRoute,
        private _service: SharedTeacherService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.path = this.data.path;
        this.loading=true;
        this._service.datilStudent(this.path ,this.data.id,this.data.data.id).subscribe((res:any)=>{
            this.attendents=res.attendents;
            this.report=res.report;
            this.dataSource=new MatTableDataSource(this.attendents);
            res.attendents.forEach((a)=>{
                if(a.status.id == 2){
                    this.total_a+=1;
                }
                if(a.status.id == 3){
                    this.total_p+=1;
                }
            })
            this.loading=false;
        })

    }
    student = this.data.data;
    attendents:any[]=[];
    total_a:number=0;
    total_p:number=0;
    ngOnInit(): void {

        console.log(this.data.data.id);


        // this.viewReport();
    }

    formatPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    getStatusSituation(status: string): string {
        switch (status) {
            case 'អវត្តមាន':
                return 'text-red-500';

            case 'វត្តមាន':
                    return 'text-green-500';
            default:
                return 'text-yellow-500';
        }
    }
    viewReport(item:any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { from: this.path ,data:item,title:this.student.name,class_id:this.data.id,user_id:this.data.data.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            SharedTeacherClassroomReportDialogComponent,
            dialogConfig
        );

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }

    viewDetail(row): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            SharedClassroomAttendanceComponent,
            dialogConfig
        );

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }
    convertToKhmerMonth(dateString: string): string {
        const khmerMonths = [
            "មករា",  // January
            "កុម្ភៈ",  // February
            "មីនា",  // March
            "មេសា",  // April
            "ឧសភា",  // May
            "មិថុនា",  // June
            "កក្កដា",  // July
            "សីហា",  // August
            "កញ្ញា",  // September
            "តុលា",  // October
            "វិច្ឆិកា",  // November
            "ធ្នូ"    // December
        ];

        const date = new Date(dateString);
        const month = date.getMonth();  // 0-11
        const year = date.getFullYear();  // Get the full year

        // Combine the Khmer month and year
        return `${khmerMonths[month]} ${year}`;
    }
}
