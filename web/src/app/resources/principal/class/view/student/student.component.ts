import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ClassroomDetailComponent } from 'app/shared/dialog/student-classroom-detail/student-classroom-detail.component';
import { helperAnimations } from 'helper/animations';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { ClassroomService } from '../../class.service';
import { Student } from '../../classroom.type';
import { GlobalConstants } from 'helper/shared/constants';
import { env } from 'envs/env';
import { PrincipleClassroomDetailComponent } from './view/view.component';
import { AddStudentCreateComponent } from './add-student/add-student.component';

@Component({
    selector: 'priniciple-class-room-student',
    standalone: true,
    imports: [
        MatIconModule,
        MatIconButton,
        MatButtonModule,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        MatCheckbox,
    ],
    templateUrl: './student.component.html',
    styleUrl: './student.component.scss',
    animations: helperAnimations,
})
export class PrincipleClassRoomStudentComponent {
    @Input() id: number;
    displayedColumns: string[] = ['profile', 'status', 'action'];
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    public data: Student[];
    public isLoading = false;
    fileUrl: string = env.FILE_BASE_URL;

    dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>(
        []
    );

    ngOnInit(): void {
        // this.viewDetail();
        this.listing();
    }

    constructor(
        private _matDialog: MatDialog,
        private _snackbarService: SnackbarService,
        private _classroomService: ClassroomService
    ) {}

    listing(_limit: number = 15, _page: number = 1): void {
        const param: { limit: number; page: number; key?: string } = {
            limit: _limit,
            page: _page,
        };
        if (this.key != '') {
            param.key = this.key;
        }
        if (this.page != 0) {
            param.page = this.page;
        }
        this.isLoading = true;
        this._classroomService.view(this.id).subscribe({
            next: (res) => {
                this.data = res.students;
                this.dataSource.data = this.data;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(
                    err?.error?.message || GlobalConstants.genericError,
                    GlobalConstants.error
                );
            },
        });
    }
    create(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { id: this.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        this._classroomService.Studentesetup(this.id).subscribe((res: any) => {
            dialogConfig.data = { id: this.id, data: res.data };
            const dialogRef = this._matDialog.open(
                AddStudentCreateComponent,
                dialogConfig
            );
            dialogRef.afterClosed().subscribe((res) => {
                this.listing();
            });
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
        dialogConfig.data = { path: 'teacher', data: item, id: this.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            PrincipleClassroomDetailComponent,
            dialogConfig
        );

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }
}
