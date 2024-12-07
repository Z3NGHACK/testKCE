import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
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
    selector: 'master-subject-update',
    standalone: true,
    imports: [
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,


    ],
    templateUrl: './update.component.html',
    styleUrl: './update.component.scss'
})
export class UpdateSubjectComponent {
    
  public createForm: FormGroup;
  selectedIconBase64: string | null = null; // Store the base64 string
  imagePreview: string | ArrayBuffer | null = null;  // This will hold the image preview
  isDeleting: boolean;
  fileUrl: string = env.FILE_BASE_URL;

  constructor(
      public dialogRef: MatDialogRef<UpdateSubjectComponent>,
      private _formBuilder: FormBuilder,
      private _subjectService: SubjectService,
      private _snackBarService: SnackbarService,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
      this.createForm = this._formBuilder.group({
          name: ['', [Validators.required]],  // Name field
          icon: ['', [Validators.required]]   // Icon file input bound to the form
      });
  }


  ngOnInit(): void {  

    this.imagePreview = this.fileUrl+ this.data?.icon ;
    this.selectedIconBase64 = this.fileUrl + this.data?.icon ;

    this.createForm.patchValue({
      icon: this.data?.icon || '',
      name: this.data?.name || '',
     
    });
  }

  selectIconFile(): void {
      const fileInput = document.getElementById('icon-file') as HTMLInputElement;
      fileInput.click();
  }

  // Convert file to Base64
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read file as Base64
      reader.onload = () => resolve(reader.result as string); // Resolve with Base64 string
      reader.onerror = (error) => reject(error); // Reject on error
    });
  }

  // Handle file selection and convert it to Base64
  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      try {
        this.selectedIconBase64 = await this.convertFileToBase64(file); // Convert to Base64
        console.log(file.type)
        this.imagePreview = this.selectedIconBase64; // Set the image preview
        this.createForm.patchValue({ icon: this.selectedIconBase64 }); // Update form control
      } catch (error) {
        console.error('File conversion failed', error);
        this.selectedIconBase64 = null;
        this.imagePreview = null;
        this.createForm.patchValue({ icon: null });
      }
    }
  }

    // Close dialog
    closeDialog(): void {
        this.dialogRef.close();
    }

    // Handle form submission
    submitForm(): void {
        const formData = this.createForm.value;
        console.log('Form Data to be Sent:', formData); 
        if (this.createForm.valid && this.selectedIconBase64) {
      
          // Debugging: Log the form data
          // Call the service to send the data
          this._subjectService.updateSubject(this.data?.id,formData).subscribe({
            next: (res) => {

              this.dialogRef.close(res);
              this._snackBarService.openSnackBar('Creation successful', GlobalConstants.success);
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