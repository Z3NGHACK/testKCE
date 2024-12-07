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
import { Bank, Exchange } from '../setting.type';
import { SettingService } from '../setting.service';
import { MatButtonModule } from '@angular/material/button';
import { number } from 'echarts';

const moment = _moment;

@Component({
    selector: ' setting-update-exchange',
    standalone: true,
    templateUrl: './update-exchange.component.html',
    styleUrls: ['./update-exchange.component.scss'],
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
export class UpdateExchangeComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    qr_src: string;
    public firstFormGroup: FormGroup;
    private _id: number;

    constructor(
        public dialogRef: MatDialogRef<UpdateExchangeComponent>,
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private _service: SettingService,
        private _snackBarService: SnackbarService,
        @Inject(MAT_DIALOG_DATA) public data: Exchange,
    ) {
        this.firstFormGroup = this._formBuilder.group({
           
            code: ['', [Validators.required]],
            number: ['', [Validators.required]],
         
        });
    }

    ngOnInit(): void {  
        this.firstFormGroup.patchValue({
            code: this.data.code || '',
            number: this.data.number || '',
  
        });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }


 
    onSubmit(): void {
        const body = this.firstFormGroup.value;
       
        this._service.updateExchange( this.data.id , body).subscribe({
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

