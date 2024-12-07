import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { env } from 'envs/env';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


@Component({
    selector: 'shared-view-classroom-attendance',
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
    templateUrl: './attendance.component.html',
    styleUrl: './attendance.component.scss'
})
export class ClassroomAttendanceComponent {

    constructor(
        public dialogRef: MatDialogRef<ClassroomAttendanceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
    ) {}

    closeDialog(): void {
        this.dialogRef.close();
    }
}
