import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import _moment from 'moment';
import { HttpClient } from '@angular/common/http';

import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { General } from 'app/shared/teacher/teacher.types';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgramService } from '../program.service';

const moment = _moment;

@Component({
    selector: 'general-manager-create-program',
    standalone: true,
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    imports: [
        MatIconModule,
        PortraitComponent,
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProgramComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: General;
    public path: 'principal' | 'general-manager';
    public disable = false;

    public setup_levels: any[];
    public setup_branchs: any[];
    public setup_academic: any[];

    constructor(
        public dialogRef: MatDialogRef<CreateProgramComponent>,
        private _formBuilder: FormBuilder,
        private _service: ProgramService,
        private _snackBarService: SnackbarService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.firstFormGroup = this._formBuilder.group({
            name: ['', [Validators.required]],
            price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Add pattern for numeric validation
            academic_id: ['', [Validators.required]],
            level_id: ['', [Validators.required]],
            branch_id: ['', [Validators.required]],
        });
    }


    ngOnInit(): void {
        setTimeout(() => {
            this.getLanguage();
        });
    }


    getLanguage(): void {
        this._service.setupCreate().subscribe({
            next: res => {
                this.setup_academic = res.data.academics;
                this.setup_levels = res.data.levels;
                this.setup_branchs = res.data.branchs;
                this._changeDetectorRef.detectChanges();
            },
            error: err => {
                this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });

        // this._service.setupLevel().subscribe({
        //     next: res => {
        //         this.setup_levels = res.data;
        //         this._changeDetectorRef.detectChanges();
        //     },
        //     error: err => {
        //         this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        //     }
        // });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }


    onSubmit(): void {
        const body = this.firstFormGroup.value;

        this._service.createGrade(body).subscribe({
            next: res => {
                setTimeout(() => {
                    this.data = res.data;
                    this._snackBarService.openSnackBar("ការបង្កើតទទួលបានជោគជ័យ", GlobalConstants.success);
                    this.dialogRef.close();
                });
            },
            error: err => {
                let message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }

}
