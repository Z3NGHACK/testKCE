import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { env } from 'envs/env';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import teacherRoutes from 'app/resources/teacher/teacher.routes';
import { from } from 'rxjs';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClassroomAttendanceComponent } from 'app/shared/student/view/classroom/attendance/attendance.component';
import { ClassroomReportComponent } from 'app/shared/student/view/classroom/report/report.component';

@Component({
    selector: 'shared-view-shift-classroom-detail',
    standalone: true,
    imports: [
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
    ],
    templateUrl: './shift-classroom-detail.component.html',
    styleUrl: './shift-classroom-detail.component.scss'
})
export class ClassroomShiftDetailComponent {
    fileUrl: string = env.FILE_BASE_URL;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    path: 'receptionist' | 'teacher'
    displayedColumns: string[] = ['profile', 'status',  'remark'];
    status_id:any;
    constructor(
        public dialogRef: MatDialogRef<ClassroomShiftDetailComponent>,
        private _matDialog: MatDialog,
        private _service: TeacherService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit(): void {
        this._service.datilShift(this.data.data.id).subscribe((res:any)=>{
            this.dataSource=res.attendents;
        })
        this.path = this.data.path
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
            default:
                return 'text-yellow-500';
        }
    }
    viewReport(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { from: 'teacher' };;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(ClassroomReportComponent, dialogConfig);

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
      }


    viewDetail(): void {
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(ClassroomAttendanceComponent, dialogConfig);

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
      }

}
