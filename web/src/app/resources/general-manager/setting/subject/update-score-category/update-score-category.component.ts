import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { env } from 'envs/env';
import { SubjectService } from '../subject.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';

import { SubjectCreateRequest } from '../subject.type';

@Component({
    selector: 'master-system-update-score-category',
    standalone: true,
    imports: [
        MatIconModule,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './update-score-category.component.html',
    styleUrl: './update-score-category.component.scss'
})
export class UpdateScoreCategoryComponent {
    
  public createForm: FormGroup;
  selectedIconBase64: string | null = null; // Store the base64 string
  imagePreview: string | ArrayBuffer | null = null;  // This will hold the image preview
  isDeleting: boolean;

  constructor(
      public dialogRef: MatDialogRef<UpdateScoreCategoryComponent>,
      private _formBuilder: FormBuilder,
      private _subjectService: SubjectService,
      private _snackBarService: SnackbarService,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
      this.createForm = this._formBuilder.group({
          name: ['', [Validators.required]],  
      });
  }


  ngOnInit(): void {  
    this.createForm.patchValue({
      
        name: this.data?.name || '',
       
    })
  }

  selectIconFile(): void {
      const fileInput = document.getElementById('icon-file') as HTMLInputElement;
      fileInput.click();
  }


  // Close dialog
  closeDialog(): void {
      this.dialogRef.close();
  }

  // Handle form submission
  submitForm(): void {
      if (this.createForm.valid ) {
        const formData= this.createForm.value;
          
        // Call the service to send the data
        this._subjectService.updateScoreCategory(this.data.id , formData).subscribe({
          next: (res) => {
            this.dialogRef.close();
            this._snackBarService.openSnackBar("ការកែប្រែទទួលបានជោគជ័យ", GlobalConstants.success);
          },
          error: (err) => {
            console.error('Error occurred:', err); // Log the error
            this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
          },
        });
      } else {
        this._snackBarService.openSnackBar('Please fill in all required fields', GlobalConstants.error);
      }
    }
}