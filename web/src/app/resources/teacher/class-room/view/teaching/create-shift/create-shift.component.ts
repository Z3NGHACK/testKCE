import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
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
import { MatSliderModule } from '@angular/material/slider';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { GlobalConstants } from 'helper/shared/constants';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import _moment, { Moment } from 'moment';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
const moment = _moment;
const MY_DATE_FORMAT = {
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
    selector: 'shared-crate-shift',
    standalone: true,
    templateUrl: './create-shift.component.html',
    styleUrl: './create-shift.component.scss',
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
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }]
})
export class ClassroomCreteShiftComponent {
    loading: boolean = true;
    categories: any[] = [];
    shift: UntypedFormGroup;
    createShift = new EventEmitter();
    filteredHours: string[] = this.filterHours();
    filteredEndHours: string[] = this.filteredHours;
    constructor(
        public dialogRef: MatDialogRef<ClassroomCreteShiftComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
        private _snackBarService: SnackbarService,
        private _service: TeacherService,
        private readonly _formBuilder: UntypedFormBuilder
    ) {}
    ngOnInit(): void {
        this.ngBuilderForm();
        this.shift.get('start_at')?.valueChanges.subscribe((startTime) => {
            this.updateEndHours(startTime);
          });
    }
    ngBuilderForm(): void {
        this.shift = this._formBuilder.group({
            start_at: [null, [Validators.required]],
            finish_at: [null, [Validators.required]],
            subject_ids: [[], [Validators.required]],
            date: [null, [Validators.required]],
        });
    }
    submit(): void {
        const selectedDate = this.shift.get('date')?.value; // Get selected date
        const startTime = this.shift.get('start_at')?.value; // Get selected start time (e.g., "10:00 AM")
        const finishTime = this.shift.get('finish_at')?.value; // Get selected finish time (e.g., "12:00 PM")

        if (selectedDate && startTime && finishTime) {
            // Combine the date with the start time
            const startDateTime = moment(selectedDate)
                .hour(this.getHour(startTime)) // Convert start time to 24-hour format
                .minute(0)
                .second(0)
                .utcOffset(0)
                .format('YYYY-MM-DD HH:mm:ss+00'); // Format to "YYYY-MM-DD HH:mm:ss+00"

            // Combine the date with the finish time
            const finishDateTime = moment(selectedDate)
                .hour(this.getHour(finishTime)) // Convert finish time to 24-hour format
                .minute(0)
                .second(0)
                .utcOffset(0)
                .format('YYYY-MM-DD HH:mm:ss+00'); // Format to "YYYY-MM-DD HH:mm:ss+00"

            // Create the body object
            const body = {
                start_at: startDateTime, // Formatted start time
                finish_at: finishDateTime, // Formatted finish time
                subject_ids: this.shift.get('subject_ids')?.value,
                date: selectedDate.format('YYYY-MM-DD HH:mm:ss+00'), // Original date if you need it
            };
            this._service.createShift(this.data.id, body)
            .subscribe({
                next: (res) => {
                    this.shift.enable();
                    console.log(res.data)
                    this.createShift.emit(res.data);
                    this.dialogRef.close(res.data);
                    this._snackBarService.openSnackBar(
                        res.message,
                        GlobalConstants.success
                    );
                },
                error: (err) => {
                    this.shift.enable();
                    let message: string =
                        err.error.message ?? GlobalConstants.genericError;
                    this._snackBarService.openSnackBar(
                        message,
                        GlobalConstants.error
                    );
                },
            });

        }


    }
    getHour(time: string): number {
        const [hour, period] = time.split(' '); // Split time into hour and AM/PM
        let hourNumber = parseInt(hour, 10);

        if (period === 'PM' && hourNumber !== 12) {
            hourNumber += 12; // Convert PM times
        }
        if (period === 'AM' && hourNumber === 12) {
            hourNumber = 0; // Handle midnight (12 AM) case
        }

        return hourNumber;
    }

        // Filters the hours to show only 7 AM to 12 PM and 2 PM to 6 PM
        filterHours(): string[] {
            const allowedHours = [];
            for (let hour = 7; hour <= 12; hour++) {
              allowedHours.push(`${hour === 12 ? 12 : hour}am`);
            }
            for (let hour = 2; hour <= 6; hour++) {
              allowedHours.push(`${hour}pm`);
            }
            return allowedHours;
          }

          // Update the end time options based on the selected start time
          updateEndHours(startTime: string): void {
            const startIndex = this.filteredHours.indexOf(startTime);
            if (startIndex >= 0) {
              // End time should be 1 hour after the selected start time or later
              this.filteredEndHours = this.filteredHours.slice(startIndex + 1);
            } else {
              // Reset if no valid start time is selected
              this.filteredEndHours = this.filteredHours;
            }

            // Reset the end time field if its value is now invalid
            if (this.shift.get('finish_at')?.value && !this.filteredEndHours.includes(this.shift.get('finish_at')?.value)) {
              this.shift.get('finish_at')?.reset();
            }
          }
    clickDate() {
        document.getElementById('date').click();
    }
    chosenDateHandler(event: any, datepicker: MatDatepicker<Date>) {
        // Retrieve the Moment.js object directly from the event
        const selectedDate = event.value;  // event.value contains a Moment object

        // Format the selected date and set time to 07:00:00
        const formattedDate = moment(selectedDate)
            .set({ hour: 7, minute: 0, second: 0 })  // Set the time to 07:00:00
            .utcOffset(0)  // Ensure it's UTC+00
            .format('YYYY-MM-DD HH:mm:ss+00');  // Format the final string

        // Set the formatted date in the form control
        this.shift.get('date')?.setValue(formattedDate.toString());

        // Close the datepicker
        datepicker.close();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
