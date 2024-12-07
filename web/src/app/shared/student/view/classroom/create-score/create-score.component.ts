import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { GlobalConstants } from 'helper/shared/constants';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
    selector: 'shared-crate-score',
    standalone: true,
    templateUrl: './create-score.component.html',
    styleUrl: './create-score.component.scss',
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
        MatProgressSpinnerModule,
    ],
})
export class ClassroomCreteScoreComponent {
    loading: boolean = true;
    categories: any[] = [];
    score: UntypedFormGroup;
    createScore = new EventEmitter();
    constructor(
        public dialogRef: MatDialogRef<ClassroomCreteScoreComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
        private _snackBarService: SnackbarService,
        private _service: TeacherService,
        private readonly _formBuilder: UntypedFormBuilder,
    ) {

    }
    ngOnInit(): void {
        this.ngBuilderForm();
        console.log(this.data.data)
    }
    ngBuilderForm(): void {
        this.score = this._formBuilder.group({
            student_id: [this.data.data.data.user_id || null, [Validators.required]],
            language_id: [this.data.language_id || null, [Validators.required]],
            categoty_id: [this.data.item.id || null, [Validators.required]],
            subject_id: [this.data.data.item.id || null, [Validators.required]],
            score: [null, [Validators.required]],
            title: [null, [Validators.required]],
            mon_id: [this.data.data.data.data.id || null, [Validators.required]],
        });
    }
    submit(): void {
        this.score.disable();
        this._service.createScore(this.data.data.data.class_id, this.score.value).subscribe({
            next: res => {

                this.score.enable();
                this.createScore.emit(res.data);
                this.dialogRef.close();
                this._snackBarService.openSnackBar(res.message, GlobalConstants.success);
            },
            error: err => {
                this.score.enable();
                let message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
    closeDialog(): void {
        this.dialogRef.close();
    }
}
