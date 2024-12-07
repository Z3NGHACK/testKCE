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
// import { ClassroomAttendanceComponent } from '../../student/view/classroom/attendance/attendance.component';
// import { ClassroomReportComponent } from '../../student/view/classroom/report/report.component';
import { ActivatedRoute } from '@angular/router';
import teacherRoutes from 'app/resources/teacher/teacher.routes';
import { from } from 'rxjs';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { selectComponent } from 'app/shared/dialog/classroom-shift-detail/select/select/select.component';
import _moment, { Moment } from 'moment';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
// Helper

// Local


const moment = _moment;
const MY_DATE_FORMAT = {
    parse: {
        dateInput: 'YYYY',
      },
      display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
      },
};

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
        selectComponent
    ],
    templateUrl: './subject-detail.component.html',
    styleUrl: './subject-detail.component.scss'
})
export class SharedShiftDetailComponent {
    fileUrl: string = env.FILE_BASE_URL;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    path: 'principal' | 'general-manager'
    displayedColumns: string[] = ['profile', 'status',  'remark'];
    status_id:any;
    general:any;
    attendents:any[]=[];
    remark:string='';
    constructor(
        public dialogRef: MatDialogRef<SharedShiftDetailComponent>,
        private _matDialog: MatDialog,
        private _service: SharedTeacherService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit(): void {
        this.path = this.data.path;
        this._service.datilShift(this.path,this.data.data.id).subscribe((res:any)=>{
            this.dataSource=res.attendents;
            this.attendents=res.attendents;
            this.general=res.general;
            console.log(this.general)
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
            case 'វត្តមាន':
                return 'text-green-500';    
            default:
                return 'text-yellow-500';
        }
    }

    // viewReport(): void {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.data = { from: 'teacher' };;
    //     dialogConfig.position = { right: '0', top: '0' };
    //     dialogConfig.height = '100vh';
    //     dialogConfig.panelClass = 'side-dialog';
    //     dialogConfig.autoFocus = false;

    //     // const dialogRef = this._matDialog.open(ClassroomReportComponent, dialogConfig);

    //     // dialogRef.afterClosed().subscribe(() => {
    //     //   this.listing();
    //     // });
    //   }


    viewDetail(): void {
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        // const dialogRef = this._matDialog.open(ClassroomAttendanceComponent, dialogConfig);

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
      }
      onchnage=false;
      onChnageStatus(event:any){
        this.onchnage=true;
        let index=this.attendents.indexOf(event)
        this.attendents[index]=event;

        this.dataSource=new MatTableDataSource(this.attendents);
        setTimeout(() => {
            let doc = document.getElementById('remark-'+event.id) as HTMLInputElement; // Typecasting to HTMLInputElement
            if (doc) {
                doc.value = event.remark;
            }
        }, 5);
      }
      onInputRemark(item: any, event: KeyboardEvent): void {
        const inputElement = event.target as HTMLInputElement;
        const inputValue = inputElement.value;
        item.remark=inputValue;
        this.attendents[this.attendents.indexOf(item)]=item;
        this.dataSource=new MatTableDataSource(this.attendents);

        // You can now use 'inputValue' and 'item' as needed
      }
}
