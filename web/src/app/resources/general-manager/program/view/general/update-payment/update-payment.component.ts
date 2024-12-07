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
    selector: 'general-manager-update-program',
    standalone: true,
    templateUrl: './update-payment.component.html',
    styleUrls: ['./update-payment.component.scss'],
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
export class UpdatePaymentComponent {

    private _id: number;
    public disable = false;

    public setup_language: any[] = [];
    public steps: any[] = [];
    constructor(
        public dialogRef: MatDialogRef<UpdatePaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { id: number, languages: any[], item: any },
        private _formBuilder: FormBuilder,
        private _service: ProgramService,
        private _snackBarService: SnackbarService,
    ) {

    }


    ngOnInit(): void {

        this.getLanguage();

    }
    getLanguage(): void {
        this._service.viewLanguage(this.data.id, this.data.item.id).subscribe({
            next: res => {
                setTimeout(() => {
                    this.steps = res.data;
                });
            },
            error: err => {

                this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    validaStep = true;
    changeStep(step: any, event: KeyboardEvent): void {
        const inputValue = (event.target as HTMLInputElement).value; // Get the input value // Get current steps or initialize empty array
        // Update the step's value dynamically
        const stepToUpdate = this.steps.find((s: any) => s.id === step.id);
        if (stepToUpdate) {
            stepToUpdate.value = inputValue;
        }
        this.validaStep = true;
        for (const step of this.steps) {
            if (!step.value) {
                this.validaStep = false; // Mark invalid and stop further checks
                break;
            }
        }
    }
    closeDialog(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        // steps = this.steps;
        this._service.updatePriceLanguage({ grade_id: this.data.id, language_id: this.data.item.id, steps: this.steps }).subscribe({
            next: res => {
                setTimeout(() => {
                    this._snackBarService.openSnackBar("កែប្រែទទួលបានជោគជ័យ", GlobalConstants.success);
                    this.dialogRef.close(this.steps);
                });
            },
            error: err => {
                let message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
}
