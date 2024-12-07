import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { General, View } from '../../../student.types';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import _moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { SharedStudentService } from '../../../student.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

const moment = _moment;

@Component({
    selector: 'shared-student-update',
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
        CommonModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatDividerModule,
    ],
})
export class SharedStudentUpdateComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: General;

    constructor(
        public dialogRef: MatDialogRef<SharedStudentUpdateComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: { row: View['general'], id: number },
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private _service: SharedStudentService,
        private _snackBarService: SnackbarService
    ) {
        this.firstFormGroup = this._formBuilder.group({
            avatar: ['', [Validators.required]],
            kh_name: ['', {
                validators: [Validators.required, Validators.pattern(/^[\u1780-\u17FF\u200C\u200D\s]+$/)],
                updateOn: 'change'
            }],
            en_name: ['', {
                validators: [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)],
                updateOn: 'change'
            }],
            sex_id: ['', [Validators.required]],
            dob: ['', [Validators.required]],
            pob: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.data = this.datas.row;
        this._id = this.datas.id;
        this.src = `${this.fileUrl}${this.data?.avatar}`;

        this.firstFormGroup.patchValue({
            avatar: this.data.avatar || '',
            kh_name: this.data.kh_name || '',
            en_name: this.data.en_name || '',
            sex_id: this.data.sex_id || '',
            dob: this.data.dob ? moment(this.data.dob).format('YYYY-MM-DD') : '',
            pob: this.data.pob || ''
        });
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

    onSubmit(): void {
        const body = this.firstFormGroup.value;

        this._service.createStudent(body, this._id).subscribe({
            next: res => {
                this._snackBarService.openSnackBar("ធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ", GlobalConstants.success);
                this.dialogRef.close(res); // Pass updated data back
            },
            error: err => {
                let message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
}
