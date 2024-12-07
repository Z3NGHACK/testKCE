import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { env } from 'envs/env';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { ReceptionistService } from 'app/resources/receptionist/receptionist.service';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { ClassroomService } from 'app/resources/principal/class/class.service';

@Component({
    selector: 'teacher-view-report-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatExpansionModule,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
})
export class TeacherScheduleDetailComponent {
    schedule: UntypedFormGroup;
    constructor(
        public dialogRef: MatDialogRef<TeacherScheduleDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly _formBuilder: UntypedFormBuilder,
        private _snackBarService: SnackbarService,
        private service: ClassroomService,

    ) {
        this.ngBuilderForm();
    }
    ngOnInit(): void {
    }
    ngBuilderForm(): void {
        this.schedule = this._formBuilder.group({
            subject_id: [null, [Validators.required]],
            day_id: [this.data.day.id, [Validators.required]],
            time_id: [this.data.time.id, [Validators.required]],
            semester_id: [this.data.semester, [Validators.required]],
        });
    }
    submit(): void {
        this.schedule.disable();
        this.service.createSchedule(this.data.id, this.schedule.value)
            .subscribe({
                next: (res) => {
                    this.schedule.enable();
                    this.dialogRef.close(res.data);
                    this._snackBarService.openSnackBar(
                        res.message,
                        GlobalConstants.success
                    );
                },
                error: (err) => {
                    this.schedule.enable();
                    let message: string =
                        err.error.message ?? GlobalConstants.genericError;
                    this._snackBarService.openSnackBar(
                        message,
                        GlobalConstants.error
                    );
                },
            });

    }
    closeDialog(): void {
        this.dialogRef.close();
    }
}
