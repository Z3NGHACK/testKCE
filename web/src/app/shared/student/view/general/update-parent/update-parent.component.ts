// ================================================================================>> Core Library
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

// ================================================================================>> Thrid Party Library
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Decoder
import jwt_decode from 'jwt-decode';

// ================================================================================>> Custom Library
// Core
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ReceptionistService } from 'app/resources/receptionist/receptionist.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import {GlobalConstants} from 'helper/shared/constants';
import { Parent } from 'app/shared/student/student.types';
import { Data } from '@angular/router';
import { SharedStudentService } from 'app/shared/student/student.service';

// Helper

// Local

@Component({
    selector: 'update-parent-profile',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,

    ],
    templateUrl: './update-parent.component.html',
    styleUrls: ['./update-parent.component.scss']
})
export class SharedUpdateParentComponent {
    // @Input() updateParent: any;
    createParent = new EventEmitter();
    public updateParent: Parent;
    public path: 'receptionist' | 'general-manager'
    parent: UntypedFormGroup;
    loading: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data : {row: Parent , path: 'receptionist' | 'general-manager' },
        private readonly _dialogRef: MatDialogRef<SharedUpdateParentComponent>,
        private readonly _formBuilder: UntypedFormBuilder,
        private readonly _service: SharedStudentService ,
        private readonly _snackBarService: SnackbarService,
        private readonly _userService: UserService
    ) { }

    ngOnInit(): void {
        this.updateParent = this.data.row;
        this.path = this.data.path;
        this.ngBuilderForm();
    }

    ngBuilderForm(): void {
        this.parent = this._formBuilder.group({
            name:       [this.updateParent?.name        || null,    [Validators.required]],
            job:        [this.updateParent?.job         || null,    [Validators.required]],
            relation:   [this.updateParent?.relation    || null,    [Validators.required]],
            phone1:     [this.updateParent?.phone1      || null,    [Validators.required,Validators.pattern('^(0[1-9][0-9]{7,8}|\\+855[1-9][0-9]{7,8})$')]],
            phone2:     [this.updateParent?.phone2      || null,    [Validators.pattern('^(0[1-9][0-9]{7,8}|\\+855[1-9][0-9]{7,8})$')]],
            facebook:   [this.updateParent?.facebook    || null,    []],
            address:    [this.updateParent?.address     || null,    [Validators.required]],
            email:      [this.updateParent?.email       || null,    [Validators.email]],
            telegram:   [this.updateParent?.telegram    || null,    []],
        });
    }


    phoneNumbersNotSameValidator(): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
          const phone1 = formGroup.get('phone1')?.value;
          const phone2 = formGroup.get('phone2')?.value;
      
          if (phone1 && phone2 && phone1 === phone2) {
            return { phoneNumbersMatch: true }; // Custom error if phone1 and phone2 are the same
          }
          return null; // No error if they are different
        };
      }


    validatePhone1Input(event: Event): void {
        const input = event.target as HTMLInputElement;
        // Regex pattern for English letters and spaces
        const validPattern = /^[0-9]*$/;
        const formControl = this.parent.get('phone1'); // Replace with the actual control name for English input

        const currentValue = formControl.value;
        if (currentValue) {
            // Check the last character of the input
            if (validPattern.test(currentValue[currentValue.length - 1]) || currentValue.length === 0) {
                // Ensure the length does not exceed 20 characters
                if (currentValue.length < 20) {
                    formControl.setValue(input.value, { emitEvent: false });
                }
            } else {
                // Remove the invalid character
                const updatedValue = currentValue.slice(0, -1);
                formControl.setValue(updatedValue, { emitEvent: false });
            }
        } else {
            formControl.setValue('', { emitEvent: false });
        }
    }
   validatePhone2Input(event: Event): void {
        const input = event.target as HTMLInputElement;
        const validPattern = /^[0-9]*$/;
        const formControl = this.parent.get('phone2');
        const phone1Value = this.parent.get('phone1').value; // Assuming phone1 is another form control

        const currentValue = formControl.value;

        // Check if phone2 is the same as phone1
        if (currentValue === phone1Value) {
            formControl.setErrors({ phone2Invalid: true });
            return; // Stop further validation
        } else {
            // Remove the error if phone2 is not the same as phone1
            formControl.setErrors(null);
        }

        if (currentValue) {
            // Check the last character of the input
            if (validPattern.test(currentValue[currentValue.length - 1]) || currentValue.length === 0) {
                // Ensure the length does not exceed 20 characters
                if (currentValue.length < 20) {
                    formControl.setValue(input.value, { emitEvent: false });
                }
            } else {
                // Remove the invalid character
                const updatedValue = currentValue.slice(0, -1);
                formControl.setValue(updatedValue, { emitEvent: false });
            }
        } else {
            formControl.setValue('', { emitEvent: false });
        }
    }
    submit(): void {
        const body = {
            name: this.parent.value.name,
            job: this.parent.value.job,
            relation: this.parent.value.relation, // Added this field
            phone1: this.parent.value.phone1,
            phone2: this.parent.value.phone2,
            email: this.parent.value.email,
            telegram: this.parent.value.telegram, // Added this field
            facebook: this.parent.value.facebook, // Added this field
            address: this.parent.value.address // Added this field
        };

        this.parent.disable();
        this._service.updateParent(this.path, this.updateParent.id, body).subscribe({
            next: (res: {message:string,parent:Parent}) => {
                this.parent.enable();
                this.createParent.emit(res);
                this._dialogRef.close(res.parent);
                this._snackBarService.openSnackBar('Parent updated successfully', GlobalConstants.success);
            },
            error: (err: any) => {
                this.parent.enable();
                const message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }


    closeDialog(): void {
        this._dialogRef.close();
    }
    onCheckPhone(){
        let phone1=this.parent.get('phone1').value;
        let phone2=this.parent.get('phone2').value;
        if(phone1 ==phone2){
            this.parent.get('phone2').setErrors(Validators.pattern);
        }
    }

}
