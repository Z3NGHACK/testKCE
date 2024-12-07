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
import { ClassroomAttendanceComponent } from '../../student/view/classroom/attendance/attendance.component';
import { ClassroomReportComponent } from '../../student/view/classroom/report/report.component';
import { ActivatedRoute } from '@angular/router';
import teacherRoutes from 'app/resources/teacher/teacher.routes';
import { from } from 'rxjs';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { selectComponent } from './select/select/select.component';
import _moment, { Moment } from 'moment';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { HeplersImgViewerComponent } from 'app/shared/img-viewer/img-viewer.component';
import { HeplersPdfViewerComponent } from 'app/shared/pdf-viewer/pdf-viewer.component';
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
    templateUrl: './shift-classroom-detail.component.html',
    styleUrl: './shift-classroom-detail.component.scss'
})
export class ClassroomShiftDetailComponent {
    fileUrl: string = env.FILE_BASE_URL;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    path: 'receptionist' | 'teacher'
    displayedColumns: string[] = ['profile', 'status', 'remark'];
    status_id: any;
    general: any;
    attendents: any[] = [];
    remark: string = '';
    constructor(
        public dialogRef: MatDialogRef<ClassroomShiftDetailComponent>,
        private _matDialog: MatDialog,
        private _service: TeacherService,
        private _snackBarService: SnackbarService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        this.listing();
        this.path = this.data.path
        // this.viewReport();


    }

    listing() {
        this._service.datilShift(this.data.data.id).subscribe((res: any) => {
            this.dataSource = new MatTableDataSource(res.attendents);
            this.attendents = res.attendents;
            this.general = res.general;
        })
    }
    formatPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    onUpload(item) {

        document.getElementById('attech-file' + item.id)?.click();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
    onFileChange(item: any, event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            this.submit(item, file);

        }
    }
    submit(item, file) {

        const form = new FormData();
        form.append('status_id', item.status.id);
        form.append('remark', item.remark);
        file ? form.append('file', file) : null;
        this._service.updateAttechment(item.id, form).subscribe({
            next: res => {
                this.listing();
                this.onchange = false;
                this._snackBarService.openSnackBar("ធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ", GlobalConstants.success);
            },
            error: err => {
                let message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
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
    onchange = false;
    onChangeStatus(type: string, event: any) {

        this.onchange = true;
        let index = this.attendents.indexOf(event)
        this.attendents[index] = event;

        this.dataSource = new MatTableDataSource(this.attendents);
        setTimeout(() => {
            let doc = document.getElementById('remark-' + event.id) as HTMLInputElement; // Typecasting to HTMLInputElement
            if (doc) {
                doc.value = event.remark;

            }
        }, 5);
        if (type == 'select') {
            if (event?.status?.id != 3) {
                this.submit(event, null);
            }

        }
    }
    viewer(file: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            url: this.fileUrl + file.uri,
            title: file.name
        };
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0px' };
        dialogConfig.height = '100dvh';
        dialogConfig.width = '100dvw';
        dialogConfig.maxWidth = '100dvw';
        dialogConfig.panelClass = 'custom-mat-dialog-full';
        dialogConfig.enterAnimationDuration = '0s';
        file.type_id = file.extension.name.toLowerCase() == 'pdf'
            ? this._matDialog.open(HeplersPdfViewerComponent, dialogConfig)
            : this._matDialog.open(HeplersImgViewerComponent, dialogConfig);
    }
    onInputRemark(item: any, event: KeyboardEvent): void {
        const inputElement = event.target as HTMLInputElement;
        const inputValue = inputElement.value;
        item.remark = inputValue;
        this.attendents[this.attendents.indexOf(item)] = item;
        this.dataSource = new MatTableDataSource(this.attendents);

        // You can now use 'inputValue' and 'item' as needed
    }
}
