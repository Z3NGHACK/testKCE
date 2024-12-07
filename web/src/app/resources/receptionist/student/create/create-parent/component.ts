// ================================================================================>> Core Library
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

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
import { GlobalConstants } from 'helper/shared/constants';

// Helper

// Local

@Component({
    selector: 'update-profile',
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
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class CreateParentComponent {
    // @Input() updateParent: any;
    createParent = new EventEmitter();
    parent: UntypedFormGroup;
    loading: boolean = true;
    constructor(
        @Inject(MAT_DIALOG_DATA) public updateParent: any,
        private readonly _dialogRef: MatDialogRef<CreateParentComponent>,
        private readonly _formBuilder: UntypedFormBuilder,
        private readonly _service: ReceptionistService,
        private readonly _snackBarService: SnackbarService,
        private readonly _userService: UserService
    ) { }

    ngOnInit(): void {

        this.ngBuilderForm();
        this.loading = false;
    }

    ngBuilderForm(): void {
        this.parent = this._formBuilder.group({
            name: [this.updateParent?.parent?.name || null, [Validators.required]],
            job: [this.updateParent?.parent?.job || null, [Validators.required]],
            relation: [this.updateParent?.parent?.relation || null, [Validators.required]],
            phone1: [this.updateParent?.parent?.phone1 || null, [Validators.required,Validators.pattern('^(0[1-9][0-9]{7,8}|\\+855[1-9][0-9]{7,8})$')]],
            phone2: [this.updateParent?.parent?.phone2 || null, [Validators.pattern('^(0[1-9][0-9]{7,8}|\\+855[1-9][0-9]{7,8})$')]],
            facebook: [this.updateParent?.parent?.facebook || null, []],
            address: [this.updateParent?.parent?.address || null, [Validators.required]],
            email: [this.updateParent?.parent?.email || null, [Validators.email]],
            telegram: [this.updateParent?.parent?.telegram || null, []],
        });
    }

    submit(): void {
        if (this.updateParent.part) {

            let parent: any = this.parent.value;
            this.parent.disable();
            this._service.addParent(this.updateParent.id, parent).subscribe({
                next: res => {

                    this.parent.enable();
                    this.createParent.emit(res.parent);
                    this._dialogRef.close();
                    this._snackBarService.openSnackBar(res.message, GlobalConstants.success);
                },
                error: err => {
                    this.parent.enable();
                    let message: string = err.error.message ?? GlobalConstants.genericError;
                    this._snackBarService.openSnackBar(message, GlobalConstants.error);
                }
            });
        } else {
            const body = {
                phone1: this.parent.value.phone1,
                name: this.parent.value.name,
                job: this.parent.value.job,
                email: this.parent.value.email,
                phone2: this.parent.value.phone2
            }
            let parent: any = this.parent.value;
            this.parent.disable();
            this._service.checkPhoneAndEmail(body).subscribe({
                next: res => {
                    if (res?.parentId?.existparent) {
                        parent = res?.parentId.existparent;
                        parent.existparent = true;
                    }
                    this.parent.enable();
                    this.createParent.emit(parent);
                    this._dialogRef.close();
                    this._snackBarService.openSnackBar(res.message, GlobalConstants.success);
                },
                error: err => {
                    this.parent.enable();
                    let message: string = err.error.message ?? GlobalConstants.genericError;
                    this._snackBarService.openSnackBar(message, GlobalConstants.error);
                }
            });
        }
    }
    oncheckPhone() {

        if (this.updateParent.parents) {
            let matchPhone1: boolean = this.updateParent.parents.find((p) => p.phone1 == this.parent.get('phone1').value || p.phone2 == this.parent.get('phone1').value);
            if (matchPhone1) {
                this.parent.get('phone1').setErrors({ invalidPhoneNumber: true });
            }
            if (this.parent.get('phone1').value == this.parent.get('phone2').value) {
                this.parent.get('phone1').setErrors({ samePhone: true });
                const currentValue = this.parent.get('phone1').value;
                const updatedValue = currentValue.slice(0, -1);
                this.parent.get('phone1').setValue(updatedValue, { emitEvent: false });
            }
        }
    }
    oncheckPhone2() {
        if (this.updateParent.parents) {
            let matchPhone1: boolean = this.updateParent.parents.find((p) => p.phone1 == this.parent.get('phone2').value || (p.phone2 != '' ? p.phone2 == this.parent.get('phone2').value : false));
            if (matchPhone1) {
                this.parent.get('phone2').setErrors({ invalidPhoneNumber: true });
            }
            if (this.parent.get('phone1').value == this.parent.get('phone2').value) {
                this.parent.get('phone2').setErrors({ samePhone: true });
                const currentValue = this.parent.get('phone2').value;
                const updatedValue = currentValue.slice(0, -1);
                this.parent.get('phone2').setValue(updatedValue, { emitEvent: false });
            }
        }
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
        this.oncheckPhone();
    }
    // validatePhone2Input(event: Event): void {
    //     const input = event.target as HTMLInputElement;
    //     // Regex pattern for English letters and spaces
    //     const validPattern = /^[0-9]*$/;
    //     const formControl = this.parent.get('phone2'); // Replace with the actual control name for English input

    //     const currentValue = formControl.value;
    //     if (currentValue) {
    //         // Check the last character of the input
    //         if (validPattern.test(currentValue[currentValue.length - 1]) || currentValue.length === 0) {
    //             // Ensure the length does not exceed 20 characters
    //             if (currentValue.length < 20) {
    //                 formControl.setValue(input.value, { emitEvent: false });
    //             }
    //         } else {
    //             // Remove the invalid character
    //             const updatedValue = currentValue.slice(0, -1);
    //             formControl.setValue(updatedValue, { emitEvent: false });
    //         }
    //     } else {
    //         formControl.setValue('', { emitEvent: false });
    //     }
    //     this.oncheckPhone2();
    // }

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
}
