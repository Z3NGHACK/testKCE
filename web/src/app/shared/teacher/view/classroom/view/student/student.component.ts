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
import { ClassroomDetailComponent } from 'app/shared/dialog/student-classroom-detail/student-classroom-detail.component';
import { helperAnimations } from 'helper/animations';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';

import { Student } from 'app/resources/principal/class/classroom.type';
import { GlobalConstants } from 'helper/shared/constants';
import { env } from 'envs/env';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { SharedClassroomDetailComponent } from './view/view.component';


@Component({
    selector: 'Shared-class-room-student',
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
    templateUrl: './student.component.html',
    styleUrl: './student.component.scss',
    animations: helperAnimations,
})

export class SharedClassRoomStudentComponent {

    @Input() id : number;
    @Input()  path: 'principal' | 'general-manager'

    displayedColumns: string[] = ['profile', 'status',  'action'];
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    public data: Student[];
    public isLoading = false;
    fileUrl: string = env.FILE_BASE_URL;

    dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>([]);
    
    ngOnInit(): void {
        setTimeout(() => {
            this.listing();
        }, 1);
    }

    constructor(
        private _matDialog : MatDialog,
        private _snackbarService: SnackbarService,
        private _classroomService: SharedTeacherService,
    ) {
        
    }   
 
    

    listing(_limit: number = 15, _page: number = 1): void {
        const param: { limit: number, page: number, key?: string } = {
            limit: _limit,
            page: _page
        };
        if (this.key != '') {
            param.key = this.key;
        }
        if (this.page != 0) {
            param.page = this.page;
        }
        this.isLoading = true;
        this._classroomService.viewClassroom(this.path , this.id).subscribe({
            next: res => {
                this.data = res.students;
                this.dataSource.data = this.data;
                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    getStatusSituation(status: boolean): string {
        switch (status) {
            case true:
                return 'text-green-500';
            default:
                return 'text-red-500';
        }
    }

    getStatusLetter(status: boolean): string {
        switch (status) {
            case true:
                return 'នៅរៀន';
            default:
                return 'ឈ​ប់រៀន';
        }
    }

    
    viewDetail(item: any): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { path: this.path , data: item , id: this.id };
        console.log(dialogConfig.data)
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            SharedClassroomDetailComponent,
            dialogConfig
        );

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }
}
