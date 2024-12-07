// ================================================================================>> Core Library
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
// ================================================================================>> Thrid Party Library
// Material
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Decoder
import jwt_decode from 'jwt-decode';

// ================================================================================>> Custom Library
// Core
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ReceptionistService } from 'app/resources/receptionist/receptionist.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
// import { MomentDateAdapter } from '@angular/material-moment-adapter';
import _moment, { Moment } from 'moment';
// Helper

// Local


const moment = _moment;
const MY_DATE_FORMAT = {
    parse: {
        dateInput: 'YYYY',
      },
      display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
      },
};

@Component({
    selector: 'update-profile',
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

    ],
    templateUrl: './template.html',
    styleUrls: ['./style.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }]
})
export class CreateHistoryComponent {
    createHistory = new EventEmitter();
    @ViewChild('startDatePicker') startDatePicker!: MatDatepicker<Date>;
    @ViewChild('endDatePicker') endDatePicker!: MatDatepicker<Date>;
    history: UntypedFormGroup;
    loading: boolean;
    year: string;
    grades: any = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public datasetup: any,
        private readonly dialogRef: MatDialogRef<CreateHistoryComponent>,
        private readonly formBuilder: UntypedFormBuilder,
        private readonly accountService: ReceptionistService,
        private readonly snackBarService: SnackbarService,
        private readonly userService: UserService
    ) { }

    ngOnInit(): void {
        this.ngBuilderForm();
    }

    ngBuilderForm(): void {
        this.history = this.formBuilder.group({
            level_id:               [null,    [Validators.required]],
            level_name:               [null,    [Validators.required]],
            start_grade_id:         [null,    [Validators.required]],
            start_grade_name:         [null,    [Validators.required]],
            end_grade_id:           [null,    [Validators.required]],
            end_grade_name:           [null,    [Validators.required]],
            school_name:            [null,    [Validators.required]],
            start_date:             [null,    [Validators.required]],
            end_date:               [null,    [Validators.required]],
        });
    }

    chosenStartYearHandler(event: any, datepicker: MatDatepicker<Date>) {
        const date = event._d;
        this.history.get('start_date')?.setValue(moment(date).format('YYYY'));
        datepicker.close();
    }

    chosenEndYearHandler(event: any, datepicker: MatDatepicker<Date>) {
        const date = event._d;
        this.history.get('end_date')?.setValue(moment(date).format('YYYY'));
        datepicker.close();
    }

    submit(): void {
        this.createHistory.emit(this.history.value);
        this.dialogRef.close();
    }

    level(item: any): void{
        this.grades = item.grades;
        this.history.get('level_name')?.setValue(item.name);
    }

    startGrade(item: any): void{
        this.history.get('start_grade_name')?.setValue(item.name);
    }

    endGrade(item: any): void{
        this.history.get('end_grade_name')?.setValue(item.name);
    }

}
