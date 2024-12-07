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
import { MatOptionModule } from '@angular/material/core';

const moment = _moment;

@Component({
    selector: 'general-manager-teacher-search',
    standalone: true,
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
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
        MatOptionModule

    ],
})
export class SearchTeacherDialogComponent {

    public firstFormGroup: FormGroup;
    private _id: number;
    public disable = false;

    public setup_level: any[];
    public setup_branch: any[];

    constructor(
        public dialogRef: MatDialogRef<SearchTeacherDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public path: any,
        private _formBuilder: FormBuilder,
        private _service: SharedTeacherService,
        private _snackBarService: SnackbarService,
        
    ) {
        this.firstFormGroup = this._formBuilder.group({
            branchId:  [''],
            levelId:  [''],
        });
    }


    ngOnInit(): void {  
        
        setTimeout(() => {
            this.getSetup();   
        });
          
    }

    getSetup(): void {  
        this._service.getSetupLevel(this.path).subscribe({
            next: res => {
                setTimeout(() => {
                    this.setup_level = res.data;
                });
            },
            error: err => {
             
                this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });

        this._service.getSetupBranch(this.path).subscribe({
            next: res => {
                setTimeout(() => {
                    this.setup_branch = res.data;
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
        this._snackBarService.openSnackBar("ការស្វែងរកទទួលបានជោគជ័យ", GlobalConstants.success);
        this.dialogRef.close(body);
    }
}
