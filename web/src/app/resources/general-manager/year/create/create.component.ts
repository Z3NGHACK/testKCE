import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import _moment, { Moment } from 'moment';
import { HttpClient } from '@angular/common/http';

import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';

const moment = _moment;
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AcademicService } from '../academic.service';


export const KHMER_DATE_FORMATS_YYYY: MatDateFormats = {
    parse: {
      dateInput: 'YYYY', // Allow parsing of YYYY
    },
    display: {
      dateInput: 'YYYY', // Display as YYYY
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
  
  export const KHMER_DATE_FORMATS_MMYYYY: MatDateFormats = {
    parse: {
      dateInput: 'MM/YYYY', // Allow parsing of MM/YYYY
    },
    display: {
      dateInput: 'MM/YYYY', // Display as MM/YYYY
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
@Component({
   
    selector: 'create-year-GM',
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
        MatMenuModule,
        MatDatepickerModule,
        MatButtonModule,
        MatSelectModule
    ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue:  KHMER_DATE_FORMATS_MMYYYY }, // Default format
      ],
})
export class YearCreateComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: any;

    constructor(
        public dialogRef: MatDialogRef<YearCreateComponent>,
        // @Inject(MAT_DIALOG_DATA) public datas: { row: View['general'], id: number },
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private _service: AcademicService,
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
    }
    status: { id: number, name: string }[] = [
      { id: 1, name: 'ដំណើការ' },
      { id: 2, name: 'ទទួលពាក្យ' },
      { id: 3, name: 'បញ្ចប់' },
  ];

    onInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        // Allow only digits and hyphen
        const filteredValue = value.replace(/[^0-9 -]/g, '');
        if (filteredValue !== value) {
            input.value = filteredValue;
        }
    }


    yearFormatValidator(control: AbstractControl): { [key: string]: any } | null {
      const value = control.value;
      const regex = /^\d{4}-\d{4}$/; // Regex for format "nnnn-nnnn"
      return regex.test(value) ? null : { invalidFormat: true }; // Return error if format is invalid
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

    parseDate(value: string): string | null {
      if (!value) return null;

      const date = new Date(value);
      if (isNaN(date.getTime())) {
          return null; // Invalid date
      }

      // Format to YYYY-MM-DD
      return date.toISOString().split('T')[0];
  }

  
  chosenYearHandler(year: number) {
      console.log("Selected year:", year); // Add this line
      const date = new Date(year, 0); // Assuming January is the intended month
      this.formatDate(date);
  }
  
  chosenMonthHandler(month: number) {
      console.log("Selected month:", month); // Add this line
      const date = new Date(new Date().getFullYear(), month); // Assuming current year
      this.formatDate(date);
  }


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

  
    formatDate(value: any) {
        if (value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date provided");
            }
            // Your existing formatting logic
        }
        return ''; // Handle cases where value is not valid
    }
  
    chosenYearHandlerEnd(normalizedYear: Date, datepicker: any) {
      const year = normalizedYear.getFullYear();
      this.firstFormGroup.get('s1_end')?.setValue(year); // Set value to MM/YYYY format (optional)
      datepicker.close(); // Close the datepicker after selection
    }

    closeDialog(): void {
        this.dialogRef.close();
    }


    chosenDobHandler(event: any) {
        const date = event._d;
        this.firstFormGroup.get('dob').setValue(moment(date).format('YYYY'));
    }

    yearOnly = (d: Date | null): boolean => {
        const year = (d || new Date()).getFullYear();
        return true; // Allow all years for selection, or customize the range of years
    };
    
    onSubmit(): void {
    
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
  
      // const body = this.firstFormGroup.value;
        this._service.create(body).subscribe({
          next: res => {
            this._snackBarService.openSnackBar("បង្កើតទទួលបានដោយជោគជ័យ", GlobalConstants.success);
            this.dialogRef.close(body); // Pass updated data back
          },
          error: err => {
              let message: string = err.error.message ?? GlobalConstants.genericError;
              this._snackBarService.openSnackBar(message, GlobalConstants.error);
          }
        });
        this.dialogRef.close();
     }
}
