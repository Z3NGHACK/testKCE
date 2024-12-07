import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Bank } from 'app/resources/accountant/setting/setting.type';
import { UpdateBankComponent } from 'app/resources/accountant/setting/update/update.component';
import { SettingService } from 'app/resources/principal/setting/setting.service';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { Info } from 'luxon';
import { InfoService } from '../info.service';

@Component({
  selector: 'master-update-school',
  standalone: true,
  imports:[MatIconModule, 
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    ],
    templateUrl: './update-school.component.html',
    styleUrls: ['./update-school.component.scss'],
})
export class UpdateSchoolComponent implements OnInit {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number

    constructor(
        public dialogRef: MatDialogRef<UpdateBankComponent>,
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _service: InfoService,
        private _snackBarService: SnackbarService
    ) {
        this.firstFormGroup = this._formBuilder.group({
            kh_name: ['', [Validators.required, Validators.pattern(/^[\u1780-\u17FF\s\u200B]+$/)]],
            en_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
            phone1: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(10) , this.noSpacesValidator()]], 
            phone2: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(10) , this.noSpacesValidator() , this.notSameAsPhone1Validator()]],
            address: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            website: ['', []],
            logo: ['', []]
        });
        
    }
    noSpacesValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const hasSpace = /\s/.test(control.value); // Check for any space
          return hasSpace ? { noSpaces: true } : null;
        };
    }

    notSameAsPhone1Validator() {
        return (control: AbstractControl) => {
          if (this.firstFormGroup) {
            const phone1 = this.firstFormGroup.get('phone1')?.value;
            if (control.value === phone1) {
              return { sameAsPhone1: true };
            }
          }
          return null;
        };
      }

    ngOnInit(): void {  
        
        this.src = `${this.fileUrl}${this.data.logo}`;
        
        this.firstFormGroup.patchValue({
            kh_name: this.data.kh_name || '',
            en_name: this.data.en_name || '',
            phone1: this.data.phone1 || '',
            phone2: this.data.phone2 || '',
            address: this.data.address || '',
            email: this.data.email || '',
            website: this.data.website || '',
            logo: this.data.logo || ''
        });
        
    }
    closeDialog(): void {
        this.dialogRef.close();
    }

    selectIconFile(): void {
        const fileInput = document.getElementById('icon-file') as HTMLInputElement;
        fileInput.click();
    }


    srcChange(base64: string, type: string): void {
        
            this.src = base64;
            this.firstFormGroup.get('logo').setValue(base64);
        
    }

    onIconFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = e.target.result;
                this.srcChange(base64, 'logo');
            };
            reader.readAsDataURL(file);
        }
    }

 

    
    onSubmit(): void {
        const body = this.firstFormGroup.value;
        this._service.updateSchoolInfo(body).subscribe({
            next: res => {
              this.data = res.data;
              this.dialogRef.close(this.data);
              this._snackBarService.openSnackBar("ធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ", GlobalConstants.success);
            },
            error: err => {
                let message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }

}
