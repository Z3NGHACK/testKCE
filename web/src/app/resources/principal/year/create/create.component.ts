import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { SettingService } from 'app/resources/principal/setting/setting.service';
import { env } from 'envs/env';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';

import { AcademicService } from '../academic.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'Principal-add-year',
  standalone: true,
  imports: [    
        MatIconModule,
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
        MatSelectModule
    ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class AddYearComponent {
  fileUrl: string = env.FILE_BASE_URL;
  src: string;
  qr_src: string;
  public firstFormGroup: FormGroup;
  public dataSetup;

  constructor(
      public dialogRef: MatDialogRef<AddYearComponent>,
      private _formBuilder: FormBuilder,
      private _http: HttpClient,
      private _service: AcademicService,
      private _snackBarService: SnackbarService,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.firstFormGroup = this._formBuilder.group({
        academic_id: ['', [Validators.required]],
    });
    
  }

    ngOnInit(): void {  
        this.getSetup()
    }

    getSetup(){
        this._service.getYearSetup().subscribe({
            next: res => {
                this.dataSetup = res;
                console.log(this.dataSetup)
            },
            error: err => {
            this._snackBarService.openSnackBar(GlobalConstants.error, GlobalConstants.error);
            }
        });// Perform the submission with both icon and QR code images
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
      const body = this.firstFormGroup.value;
     
      this._service.addYear(body).subscribe({
          next: res => {
            this.data = res;
            this._snackBarService.openSnackBar("ធ្វើបញ្ចូលភាពដោយជោគជ័យ", GlobalConstants.success);
            this.dialogRef.close(res.data);
          },
          error: err => {
              let message: string = err.error.message ?? GlobalConstants.genericError;
              this._snackBarService.openSnackBar(message, GlobalConstants.error);
          }
        });// Perform the submission with both icon and QR code images
  }
}
