import { ChangeDetectorRef, Component, Inject } from '@angular/core';
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
import { ProgramService } from '../../../program.service';
import { CreateProgramComponent } from '../../../create/create.component';
import { MatOptionModule } from '@angular/material/core';

const moment = _moment;

@Component({
    selector: 'general-manager-create-program',
    standalone: true,
    templateUrl: './create-score-category.component.html',
    styleUrls: ['./create-score-category.component.scss'],
    imports: [
        MatIconModule,
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
        MatOptionModule

    ],
})
export class AddScoreCategoryComponent {

    public firstFormGroup: FormGroup;
    private _id: number;
    public disable = false;

    public setup: any[];

    constructor(
        public dialogRef: MatDialogRef<AddScoreCategoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: number,
        private _formBuilder: FormBuilder,
        private _service: ProgramService,
        private _snackBarService: SnackbarService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.firstFormGroup = this._formBuilder.group({
            grade_id:  ['', [Validators.required]],
            score_category_id:  ['', [Validators.required]],
            percentage: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.max(100)]],
        });
    }


    ngOnInit(): void {  
        setTimeout(() => {
            this.getsetup();   
        });
        
        this.firstFormGroup.patchValue({
            grade_id: this.data|| '',
        });
    }

    getsetup(): void {  
        this._service.setupScoreSubject().subscribe({
            next: res => {
                setTimeout(() => {
                    this.setup = res.data;
                    console.log(this.setup)
                });
            },
            error: err => {
             
                this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
  
    }
    closeDialog(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        const body = this.firstFormGroup.value;
       
        this._service.createSubjectCategory(body).subscribe({
          next: res => {
            setTimeout(() => {
                this._snackBarService.openSnackBar("ការបង្កើតទទួលបានជោគជ័យ", GlobalConstants.success);
                this.dialogRef.close(body);
            });
          },
          error: err => {
              let message: string = err.error.message ?? GlobalConstants.genericError;
              this._snackBarService.openSnackBar(message, GlobalConstants.error);
          }
        });
    }
}
