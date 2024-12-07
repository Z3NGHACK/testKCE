import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatSliderModule } from '@angular/material/slider';
import { TeacherService } from 'app/resources/teacher/teacher.service';
// import { PrincipleClassroomMonthlyReportComponent } from '../monthly-report/monthly-report.component';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { SharedClassroomMonthlyReportComponent } from '../monthly-report/monthly-report.component';
// import { ClassroomMonthlyReportComponent } from '../monthly-report/monthly-report.component';

@Component({
    selector: 'shared-view-classroom-report-dialog',
    standalone: true,

    imports: [
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
        MatSliderModule,
        FormsModule,
    ],
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss',
})
export class SharedTeacherClassroomReportDialogComponent {
    dataSources: { [key: string]: MatTableDataSource<any> } = {};
    path: 'principal' | 'general-manager';
    displayedColumns: string[] = ['position', 'subject', 'point', 'action'];
    sliderValue1: number = 3; // Default value
    sliderValue2: number = 3;
    sliderValue3: number = 3;
    sliderValue4: number = 3;
    loading: boolean = true;
    languages: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<SharedTeacherClassroomReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
        private _service: SharedTeacherService
    ) {
        this.path = this.data?.from;
        this.listing();
    }


    listing() {
        this.loading = true;
        this._service
            .reportBymonth(this.path, this.data.class_id, this.data.user_id, {
                mon_id: this.data.data.id
            })
            .subscribe((res: any) => {
                this.languages = res.languages;
                this.languages.forEach((l) => {
                    this.dataSources[l.id] = new MatTableDataSource<any>(
                        l.subjects
                    );
                });

                this.loading = false;
            });
    }
    resetValue(): void {
        // Reset the slider to the original value, effectively preventing any changes
        this.sliderValue1 = 3;
        this.sliderValue2 = 3;
        this.sliderValue3 = 3;
        this.sliderValue4 = 3;
    }
    getSliderClass(value: number): string {
        if (value > 0 && value <= 1) {
            return '';
        } else if (value > 1 && value <= 2) {
            return 'slider-orange';
        } else if (value > 2 && value <= 3) {
            return 'slider-blue';
        } else if (value > 3 && value <= 4) {
            return 'slider-darkblue';
        } else if (value > 4 && value <= 5) {
            return 'slider-green';
        }
        return '';
    }

    getGrade(value: number): string {
        if (value > 0 && value <= 1) {
            return 'ខ្សោយ'; // Bad
        } else if (value > 1 && value <= 2) {
            return 'មធ្យម'; // Average
        } else if (value > 2 && value <= 3) {
            return 'ល្អបង្គួរ'; // Normal
        } else if (value > 3 && value <= 4) {
            return 'ល្អ'; // Good
        } else if (value > 4 && value <= 5) {
            return 'ល្អប្រសើរ'; // Very Good
        }
        return 'ខ្សោយ';
    }

    getGradeColor(value: number): string {
        if (value > 0 && value <= 1) {
            return 'text-red-500'; // Bad
        } else if (value > 1 && value <= 2) {
            return 'text-orange-500'; // Average
        } else if (value > 2 && value <= 3) {
            return 'text-blue-500'; // Normal
        } else if (value > 3 && value <= 4) {
            return 'text-blue-900'; // Good
        } else if (value > 4 && value <= 5) {
            return 'text-green-700'; // Very Good
        }
        return 'text-red-500';
    }

    viewDetail(item, l_id): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { path: this.path, data: this.data, item: item, l_id: l_id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            SharedClassroomMonthlyReportComponent,
            dialogConfig
        );

        dialogRef.afterClosed().subscribe(() => {
            this.listing();
        });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
