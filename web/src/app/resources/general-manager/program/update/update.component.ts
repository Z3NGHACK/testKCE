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
    selector: 'general-manager-update-program',
    standalone: true,
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
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
export class UpdateProgramComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: General ;
    public path: 'principal' | 'general-manager';
    public disable = false;

    public setup_levels: any[];
    public setup_academic: any[];

    constructor(
        public dialogRef: MatDialogRef<UpdateProgramComponent>,
        private _formBuilder: FormBuilder,
        private _service: ProgramService,
        @Inject(MAT_DIALOG_DATA) public datas: {  id: number ,data: any,},
        private _snackBarService: SnackbarService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.firstFormGroup = this._formBuilder.group({
            name: ['', [Validators.required]],
            price_per_year: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            level_id:  ['', [Validators.required]],
           
        });
    }


    ngOnInit(): void { 
        setTimeout(() => {
            this.getLanguage();
        });      
        this._id = this.datas.id;
        this.firstFormGroup.patchValue({
            name: this.datas.data.name || '',
            price_per_year : this.datas.data.price_per_year|| '',
            level_id: this.datas.data.level_id || '',
        });

    }
    

    getLanguage(): void{   
        this._service.setupAcademic().subscribe({
            next: res => { 
                this.setup_academic = res.data;
                this._changeDetectorRef.detectChanges();  
            },
            error: err => {
                this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
        
        this._service.setupLevel().subscribe({
            next: res => { 
                this.setup_levels = res.data;
                this._changeDetectorRef.detectChanges(); 
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
       
        this._service.udpateProgram(this._id  , body).subscribe({
          next: res => {
            setTimeout(() => {
                this._snackBarService.openSnackBar("ធ្វើបច្ចុប្បន្នភាពទទួលបានជោគជ័យ", GlobalConstants.success);
                this.dialogRef.close(res.general);
            });
          },
          error: err => {
              let message: string = err.error.message ?? GlobalConstants.genericError;
              this._snackBarService.openSnackBar(message, GlobalConstants.error);
          }
        });
    }

}
