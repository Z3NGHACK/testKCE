import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Bank } from '../setting.type';
import { SettingService } from '../setting.service';
import { MatButtonModule } from '@angular/material/button';

const moment = _moment;

@Component({
    selector: ' setting-create-bank',
    standalone: true,
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    imports: [
        MatIconModule,
        PortraitComponent,
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatMenuModule,
        MatButtonModule,
        
    ],
})
export class CreateBankComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    qr_src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: any;

    constructor(
        public dialogRef: MatDialogRef<CreateBankComponent>,
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private _service: SettingService,
        private _snackBarService: SnackbarService,
        
    ) {
        this.firstFormGroup = this._formBuilder.group({
            icon: ['', [Validators.required]],
            qr_icon: ['', [Validators.required]],
            name: ['', [Validators.required]],
            account_name: ['', [Validators.required]],
            account_number: ['', [
                Validators.required,
                Validators.pattern('^[0-9]+$') 
            ]],
        });
    }

    ngOnInit(): void {  
        this.src = `images/icon/photo.png`;
        this.qr_src = `images/icon/qr_code.png`;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    selectIconFile(): void {
        const fileInput = document.getElementById('icon-file') as HTMLInputElement;
        fileInput.click();
    }

    selectQrFile(): void {
        const fileInput = document.getElementById('qr-file') as HTMLInputElement;
        fileInput.click();
    }

    srcChange(base64: string, type: string): void {
        if (type === 'icon') {
            this.src = base64;
            this.firstFormGroup.get('icon').setValue(base64);
        } else if (type === 'qr_icon') {
            this.qr_src = base64;
            this.firstFormGroup.get('qr_icon').setValue(base64);
        }
    }

    onIconFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = e.target.result;
                this.srcChange(base64, 'icon');
            };
            reader.readAsDataURL(file);
        }
    }

    onQrFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = e.target.result;
                this.srcChange(base64, 'qr_icon');
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        const body = this.firstFormGroup.value;
       
        this._service.createbank(body).subscribe({
            next: res => {
              this.data = res;
              this.dialogRef.close(this.data);
              this._snackBarService.openSnackBar("ធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ", GlobalConstants.success);
            },
            error: err => {
                let message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
          });// Perform the submission with both icon and QR code images
    }
}

