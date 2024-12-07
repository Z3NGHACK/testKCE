import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
    selector: 'master-system-create',
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
        MatButtonModule
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
})
export class CreateSubjectComponent {
    
    public createForm: FormGroup;
    selectedIconBase64: string | null = null; // Store the base64 string
    imagePreview: string | ArrayBuffer | null = null;  // This will hold the image preview
  isDeleting: boolean;

  constructor(
      public dialogRef: MatDialogRef<CreateSubjectComponent>,
      private _formBuilder: FormBuilder,
      private _subjectService: SubjectService,
      private _snackBarService: SnackbarService
  ) {
      this.createForm = this._formBuilder.group({
          name: ['', [Validators.required]],  // Name field
          icon: ['', [Validators.required]]   // Icon file input bound to the form
      });
  }


  ngOnInit(): void {  
    this.imagePreview = `images/icon/photo.png`;
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
        if (this.createForm.valid && this.selectedIconBase64) {
          const formData: SubjectCreateRequest = {
            subject_id: 1, // Replace with dynamic value if needed
            name: this.createForm.get('name')?.value,
            icon: this.selectedIconBase64, // Send the Base64-encoded image
          };
    
          // console.log('Form Data to be Sent:', formData); 
    
          // Call the service to send the data
          this._subjectService.createSubject(formData).subscribe({
            next: (res) => {
              this.dialogRef.close();
              this._snackBarService.openSnackBar("ការបង្កើតដោយជោគជ័យ", GlobalConstants.success);
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