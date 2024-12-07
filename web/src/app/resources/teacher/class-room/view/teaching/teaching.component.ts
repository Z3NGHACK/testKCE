import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { ClassroomShiftDetailComponent } from 'app/shared/dialog/classroom-shift-detail/shift-classroom-detail.component';
import { ClassroomDetailComponent } from 'app/shared/dialog/student-classroom-detail/student-classroom-detail.component';
import { ClassroomCreteShiftComponent } from './create-shift/create-shift.component';

@Component({
    selector: 'teacher-class-room-teaching',
    standalone: true,
    imports: [
        MatIconModule,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    templateUrl: './teaching.component.html',
    styleUrl: './teaching.component.scss'
})
export class ClassRoomTeachingComponent {
    @Input() data: any;
    @Input() general: any;
    @Input() id: number;
    displayedColumns: string[] = ['time', 'subject', 'class', 'action'];
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DES'];
    subjects: any[] = [];
    constructor(
        private _matDialog: MatDialog,
        private _service: TeacherService,
    ) {

    }
    ngOnInit(): void {
        this.dataSource = this.data;
        this._service.getSetup(this.id).subscribe((res: any) => {
            this.subjects = res.data;
        })
    }
    transform(value: Date | string): string {
        const date = new Date(value);
        const day = date.getDate();
        const month = this.monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }
    getStatusSituation(status: string): string {
        switch (status) {
            case 'នៅរៀន':
                return 'text-green-500';
            default:
                return 'text-red-500';
        }
    }

    viewDetail(data): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { path: 'teacher', data: data, general: this.general };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(ClassroomShiftDetailComponent, dialogConfig);

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }
    cretaeShift(): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { path: 'teacher', id: this.id, setup: this.subjects };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(ClassroomCreteShiftComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                let data = this.data;
                data.push(res);
                this.dataSource = new MatTableDataSource(data);
            }

        });
    }
    getHout(time: any) {
        const date = new Date(time);

        // Get the hour in 12-hour format with am/pm
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        }).toLowerCase();
    }
}

