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
import { SubjectService } from '../../subject.service';

@Component({
  selector: 'app-update-rate',
  standalone: true,
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
  templateUrl: './update-subject.component.html',
  styleUrl: './update-subject.component.scss'
})
export class UpdateEachSubjectComponent {
  fileUrl: string = env.FILE_BASE_URL;
  src: string;
  qr_src: string;
  public firstFormGroup: FormGroup;
  public id: number;

  constructor(
      public dialogRef: MatDialogRef<UpdateEachSubjectComponent>,
      private _formBuilder: FormBuilder,
      private _http: HttpClient,
      private _service: SubjectService,
      private _snackBarService: SnackbarService,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.firstFormGroup = this._formBuilder.group({
     
      name: ['', [Validators.required]],
    });
    
  }

  ngOnInit(): void {  
    this.id = this.data.id;

    this.firstFormGroup.patchValue({
        name: this.data?.data.name || ''
      });
  }

  closeDialog(): void {
      this.dialogRef.close();
  }


  onSubmit(): void {
      const body = this.firstFormGroup.value;
     
      this._service.updateNewSubject(body, this.id ,this.data.data.id).subscribe({
          next: res => {
            this.data = res;
            this._snackBarService.openSnackBar("ធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ", GlobalConstants.success);
            this.dialogRef.close(res.data);
          },
          error: err => {
              let message: string = err.error.message ?? GlobalConstants.genericError;
              this._snackBarService.openSnackBar(message, GlobalConstants.error);
          }
        });// Perform the submission with both icon and QR code images
  }
}
