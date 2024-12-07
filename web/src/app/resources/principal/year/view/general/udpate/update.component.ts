import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import _moment from 'moment';
import { HttpClient } from '@angular/common/http';

import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';

const moment = _moment;
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


const KHMER_MONTHS = [
    'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
    'កក្កដា', 'សីហា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ', 'មករា'
  ];
  
  const KHMER_DATE_FORMATS = {
    parse: {
      dateInput: 'MM/YYYY',
    },
    display: {
      dateInput: 'MM/YYYY',
      monthYearLabel: 'MM/YYYY',
      monthYearA11yLabel: 'MM/YYYY',
    }
  };
  
@Component({
   
    selector: 'udpate-year-principal',
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
        MatMenuModule,
        MatDatepickerModule
    ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: KHMER_DATE_FORMATS }
    ],    
})
export class YearUpdateComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: any;

    constructor(
        public dialogRef: MatDialogRef<YearUpdateComponent>,
        // @Inject(MAT_DIALOG_DATA) public datas: { row: View['general'], id: number },
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        // private _service: SharedStudentService,
        private _snackBarService: SnackbarService
    ) {
        this.firstFormGroup = this._formBuilder.group({
            start_year: ['', [Validators.required]],
            end_year: ['', [Validators.required]],
            s1_start: ['', [Validators.required]],
            s1_end: ['', [Validators.required]],
            s2_start: ['', [Validators.required]],
            s2_end: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {  
        // this.data = this.datas.row;
        // this._id = this.datas.id;
        this.src = `${this.fileUrl}${this.data?.avatar}`;
        
        // this.firstFormGroup.patchValue({
        //     avatar: this.data.avatar || '',
        //     kh_name: this.data.kh_name || '',
        //     en_name: this.data.en_name || '',
        //     sex_id: this.data.sex_id || '',
        //     dob: this.data.dob ? moment(this.data.dob).format('YYYY-MM-DD') : '',
        //     pob: this.data.pob || ''
        // });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    selectCoverFile(): void {
        const fileInput = document.getElementById('portrait-fileCover') as HTMLInputElement;
        fileInput.click();
    }

    srcChange(base64: string): void {
        this.src = base64;
        this.firstFormGroup.get('avatar').setValue(base64);
    }

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = e.target.result;
                this.srcChange(base64);
            };
            reader.readAsDataURL(file);
        }
    }

    chosenDobHandler(event: any) {
        const date = event._d;
        this.firstFormGroup.get('dob').setValue(moment(date).format('YYYY-MM-DD'));
    }

    chosenYearHandler(event: any, datepicker: MatDatepicker<Date>) {
        const date = event._d;
        this.firstFormGroup.get('start_year')?.setValue(moment(date).format('YYYY'));
        datepicker.close();
        
    }
    
    
    onSubmit(): void {
    
        // if (this.firstFormGroup.invalid) {
        //   // Mark all controls as touched to show validation errors
        //   this._snackBarService.openSnackBar("not complete", GlobalConstants.error);
        //   return;
        // }
      
        const startYear = this.firstFormGroup.get('start_year')?.value;
        const endYear = this.firstFormGroup.get('end_year')?.value;
        
        const startYearS1 = this.firstFormGroup.get('s1_start')?.value;
        const endYearS1 = this.firstFormGroup.get('s1_end')?.value;

        const startYearS2 = this.firstFormGroup.get('s2_start')?.value;
        const endYearS2 = this.firstFormGroup.get('s2_end')?.value;

        if ((startYearS1 && endYearS1 && startYearS1 > endYearS1) || (startYearS2 && endYearS2 && startYearS2 > endYearS2) ) {
          // Show error message if start_year is greater than end_year
          this._snackBarService.openSnackBar("ចាប់ផ្តើមមិនអាចបន្ទាប់ពីបញ្ចប់បានទេ", GlobalConstants.error);
          return;
        }
      
        const body = this.firstFormGroup.value;
      
        // Proceed with form submission
        // this._service.createStudent(body, this._id).subscribe({
        //   next: res => {
        //     this._snackBarService.openSnackBar("Update successful", GlobalConstants.success);
        //     this.dialogRef.close(body); // Pass updated data back
        //   },
        //   error: err => {
        //       let message: string = err.error.message ?? GlobalConstants.genericError;
        //       this._snackBarService.openSnackBar(message, GlobalConstants.error);
        //   }
        // });


        this.dialogRef.close();
      }
      
}
