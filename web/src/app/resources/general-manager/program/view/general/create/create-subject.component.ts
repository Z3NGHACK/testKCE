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
    templateUrl: './create-subject.component.html',
    styleUrls: ['./create-subject.component.scss'],
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
export class CreateSubjectComponent {

    public firstFormGroup: FormGroup;
    private _id: number;
    public disable = false;

    public setup_language: any[] = [];
    public steps = [];
    constructor(
        public dialogRef: MatDialogRef<CreateSubjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { id: number, languages: any[] },
        private _formBuilder: FormBuilder,
        private _service: ProgramService,
        private _snackBarService: SnackbarService,
    ) {
        this.firstFormGroup = this._formBuilder.group({
            grade_id: ['', [Validators.required]],
            language_id: ['', [Validators.required]],
        });
    }


    ngOnInit(): void {
        setTimeout(() => {
            this.getLanguage();
        });

        this.firstFormGroup.patchValue({
            grade_id: this.data.id || '',
        });
    }

    getLanguage(): void {
        this._service.setupLanguage().subscribe({
            next: res => {
                setTimeout(() => {
                    // this.setup_language=res.data;
                    res.data.forEach(s => {
                        console.log(this.data.languages.find(l => l.id == s.id))
                        if (!this.data.languages.find(l => l.id == s.id)) {
                            this.setup_language.push(s)
                        };
                    });
                    console.log(this.setup_language)

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
    getStepsForSelectedLanguage() {
        const languageId = this.firstFormGroup.get('language_id')?.value;
        const language = this.setup_language.find(s => s.id === languageId);
        this.steps = language?.steps?.map(v => { v.value = ''; return v; });
        this.validaStep = true; // Assume valid initially
        for (const step of this.steps) {
            if (!step.value) {
                this.validaStep = false; // Mark invalid and stop further checks
                break;
            }
        }
    }

    onSubmit(): void {
        const body = this.firstFormGroup.value;
        body.steps = this.steps;
        this._service.createLanguage(body).subscribe({
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
