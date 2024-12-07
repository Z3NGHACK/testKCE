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
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { ReceptionistService } from 'app/resources/receptionist/receptionist.service';
import { SharedTeacherClassroomReportDialogComponent } from 'app/shared/teacher/view/classroom/view/student/report/report.component';
import { ClassroomDetailComponent } from 'app/shared/dialog/student-classroom-detail/student-classroom-detail.component';
import { ClassroomReportComponent } from 'app/shared/student/view/classroom/report/report.component';

@Component({
    selector: 'teacher-view-report-detail',
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
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
})
export class TeacherViewReportDetailComponent {
    fileUrl: string = env.FILE_BASE_URL;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['no', 'code', 'name', 'total_score', 'avg', 'rate', 'action'];
    score_table: any = {};
    rates: any[] = [];
    loading = true;
    total_rate = 0;
    total_female = 0;
    constructor(
        public dialogRef: MatDialogRef<TeacherViewReportDetailComponent>,
        private _service: TeacherService,
        private _matDialog: MatDialog,
        private _Rservice: ReceptionistService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.loading = true;
        this._service.datilReport(this.data.id, this.data.month.id).subscribe((res: any) => {

            this.score_table = res.data.score_table;
            this.rates = res.data.rates;
            res.data.rates.forEach(r => {
                this.total_rate += r.total;
                this.total_female += r.total_female;
            })
            this.dataSource = new MatTableDataSource(res.data.score_table.students);

            this.loading = false;
        })

    }
    ngOnInit(): void {
    }
    closeDialog(): void {
        this.dialogRef.close();
    }
    viewDetail(item: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { from: 'teacher', data: this.data.month, title: item.name, class_id: this.data.id, user_id: item.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            ClassroomReportComponent,
            dialogConfig
        );

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }
}
