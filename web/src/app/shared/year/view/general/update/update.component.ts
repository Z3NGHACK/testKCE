import { ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import _moment, { isMoment, Moment } from 'moment';
import { HttpClient } from '@angular/common/http';

import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';

const moment = _moment;
import { MatMomentDateModule, MomentDateAdapter, provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { General } from 'app/resources/principal/year/academic.type';
import { values } from 'lodash';
import { SharedAcademicService } from 'app/shared/year/year.service';

  export const MY_FORMATS = {
    parse: {
      dateInput: 'MM/YYYY',
    },
    display: {
      dateInput: 'MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
@Component({
   
    selector: 'shared-udpate-year',
    standalone: true,
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
    imports: [
        MatIconModule,
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatMenuModule,
        MatButtonModule,
        MatSelectModule,
        MatMomentDateModule,
        FormsModule
    ],
    providers: [
        // { provide: DateAdapter, useClass: MomentDateAdapter },
        // { provide: MAT_DATE_FORMATS, useValue:  KHMER_DATE_FORMATS_MMYYYY }, // Default format
        provideMomentDateAdapter(MY_FORMATS),
      ],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedYearUpdateComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: General;
    path: 'principal' | 'general-manager';

    constructor(
        public dialogRef: MatDialogRef<SharedYearUpdateComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: { row: General , id: number , path: 'principal' | 'general-manager'},
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private _service: SharedAcademicService,
        private _snackBarService: SnackbarService
    ) {
        this.firstFormGroup = this._formBuilder.group({
            name: ['', [Validators.required, this.yearFormatValidator]],
            s1_start: ['', [Validators.required]],
            s1_end: ['', [Validators.required]],
            s2_start: ['', [Validators.required]],
            s2_end: ['', [Validators.required]],
            academics_status_id: ['', [Validators.required]],
        });

        this.path = datas.path;
        this._id = this.datas.id;
    }
    status: { id: number, name: string }[] = [
      { id: 1, name: 'ដំណើការ' },
      { id: 2, name: 'ទទួលពាក្យ' },
      { id: 3, name: 'បញ្ចប់' },
    ];

    ngOnInit(): void {  
      const data = this.datas.row;

      this.firstFormGroup.patchValue({
          name: data.name || '',
          s1_start: data.semesters[0].start_date ? moment(data.semesters[0].start_date).format('YYYY-MM-DD') : '',
          s1_end: data.semesters[0].finish_date ? moment(data.semesters[0].finish_date).format('YYYY-MM-DD') : '',
          s2_start: data.semesters[1].start_date ? moment(data.semesters[0].start_date).format('YYYY-MM-DD') : '',
          s2_end: data.semesters[1].finish_date ? moment(data.semesters[1].finish_date).format('YYYY-MM-DD') : '',
          academics_status_id: data.academics_status_id || '',
      });

      // console.log(this.firstFormGroup.value);
    }

    onInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        // Allow only digits and hyphen
        const filteredValue = value.replace(/[^0-9 -]/g, '');
        if (filteredValue !== value) {
            input.value = filteredValue;
        }
    }


    // chosenS1StartHandler(event: any) {
    //   const selectedDate = event.value;  // Use event.value to get the selected date
    //   console.log(selectedDate)
    //   // if (selectedDate) {
    //   //   const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    //   //   this.firstFormGroup.get('s1_start').setValue(formattedDate);  // Set the formatted date in the form control
    //   //   console.log(this.firstFormGroup.get('s1_start').value);  // Log the value of the form control
    //   // } else {
    //   //   console.log('No date selected');
    //   // }
    // }


    // chosenS1StartHandler(event: any) {
    //     const date = event._d;
    //     this.firstFormGroup.get('s1_start').setValue(moment(date).format('YYYY-MM-DD'));
    // }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, name: string) {
      // Get the current value or initialize with today's date if empty
      const ctrlValue = this.firstFormGroup.get(name).value ? moment(this.firstFormGroup.get(name).value) : moment();
      
      // Set the selected year and month
      ctrlValue.year(normalizedMonthAndYear.year());
      ctrlValue.month(normalizedMonthAndYear.month());
    
      // Format the value to 'YYYY-MM' for storage or display
      this.firstFormGroup.get(name).setValue(ctrlValue.format('YYYY-MM'));
      console.log(ctrlValue)
      // Close the datepicker after selecting month and year


      datepicker.close();
    }

    
    yearFormatValidator(control: AbstractControl): { [key: string]: any } | null {
        const value = control.value;
        const regex = /^\d{4}-\d{4}$/; // Regex for format "nnnn-nnnn"
        return regex.test(value) ? null : { invalidFormat: true }; // Return error if format is invalid
    }

    parseDate(value: string): string | null {
        if (!value) return null;

        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return null; // Invalid date
        }

        // Format to YYYY-MM-DD
        return date.toISOString().split('T')[0];
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    
    onSubmit(): void {
    
        // if (this.firstFormGroup.invalid) {
        //   // Mark all controls as touched to show validation errors
        //   this._snackBarService.openSnackBar("not complete", GlobalConstants.error);
        //   return;
        // }
      
        const startYearS1 = moment(this.firstFormGroup.get('s1_start').value).format('YYYY-MM')
        const endYearS1 =  moment(this.firstFormGroup.get('s1_end').value).format('YYYY-MM-DD');

        const startYearS2 =  moment(this.firstFormGroup.get('s2_start').value).format('YYYY-MM-DD');
        const endYearS2 = moment(this.firstFormGroup.get('s2_end').value).format('YYYY-MM-DD');

        if ((startYearS1 && endYearS1 && startYearS1 > endYearS1) || (startYearS2 && endYearS2 && startYearS2 > endYearS2) ) {
          // Show error message if start_year is greater than end_year
          this._snackBarService.openSnackBar("ចាប់ផ្តើមមិនអាចបន្ទាប់ពីបញ្ចប់បានទេ", GlobalConstants.error);
          return;
        }
      
        const semesters = [
          {
              title: 'Semester 1',
              start_date: startYearS1,
              finish_date: endYearS1,
          },
          {
              title: 'Semester 2',
              start_date: startYearS2,
              finish_date: endYearS2,
          }
        ];
  
      // Create the full request body including the semesters array
      const body = {
          name: this.firstFormGroup.get('name')?.value,
          from_year: startYearS1,
          to_year: endYearS2,     
          academics_status_id: this.firstFormGroup.get('academics_status_id').value, 
          semesters: semesters,   
      };
      // console.log(body.semesters)
      // const body = this.firstFormGroup.value;
        this._service.update(this.path , body , this._id).subscribe({
          next: res => {
            this._snackBarService.openSnackBar("បង្កើតទទួលបានដោយជោគជ័យ", GlobalConstants.success);
            this.dialogRef.close(res); // Pass updated data back
          },
          error: err => {
              let message: string = err.error.message ?? GlobalConstants.genericError;
              this._snackBarService.openSnackBar(message, GlobalConstants.error);
          }
        });
        
     }
}
