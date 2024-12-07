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
import { env } from 'envs/env';
@Component({
    selector: 'teacher-class-room-student',
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
export class ClassRoomStudentComponent {
    @Input() data: any[];
    fileUrl = env.FILE_BASE_URL;
    @Input() id:number;
    displayedColumns: string[] = ['profile', 'status', 'action'];
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.data);
        // this.viewDetail();
    }

    constructor(private _matDialog: MatDialog) {}

    getStatusSituation(status: string): string {
        if (status) {
            return 'text-green-500';
        } else {
            return 'text-red-500';
        }
    }

    viewDetail(item: any): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { path: 'teacher', data: item,id:this.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            ClassroomDetailComponent,
            dialogConfig
        );

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }
}
