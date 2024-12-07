import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { General } from '../../../staff.type';
import { MatSelectModule } from '@angular/material/select';
import { env } from 'envs/env';
import { StaffService } from '../../../staff.service';
import { MatButtonModule } from '@angular/material/button';


const moment = _moment;
const ROLE_MAP = {
    2: 'នាយកសាលា',
    3: 'គណនេយ្យ',
    4: 'អ្នកទទួលភ្ញៀវ',
    5: 'គ្រូបង្រៀន',
    6: 'អាណាព្យបាល'
};

@Component({
    selector: 'principle-staff-update',
    standalone: true,
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
    imports: [
        MatIconModule,
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatMenuModule,
        MatSelectModule,
        MatButtonModule
    ],
})
export class StaffUpdateComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: General;
    public path: 'principal' | 'general-manager';

    roleIds = new FormControl([]);
    roleList: { id: number, name: string }[] = [
        { id: 2, name: 'នាយកសាលា' },
        { id: 3, name: 'គណនេយ្យ' },
        { id: 4, name: 'អ្នកទទួលភ្ញៀវ' },
        { id: 5, name: 'គ្រូបង្រៀន' },
        { id: 6, name: 'អាណាព្យបាល' }
    ];

    noSpacesValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const hasSpace = /\s/.test(control.value); // Check for any space
          return hasSpace ? { noSpaces: true } : null;
        };
    }

    constructor(
        public dialogRef: MatDialogRef<StaffUpdateComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: { data: General, id: number, path: 'principal' | 'general-manager' },
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private _service: StaffService,
        private _snackBarService: SnackbarService
    ) {
        this.firstFormGroup = this._formBuilder.group({
            avatar: ['', [Validators.required]],
            sex_id: ['', [Validators.required]],
            name: ['', [Validators.required]],
            phone: ['', [Validators.required, Validators.pattern('^(0[1-9][0-9]{7,8}|\\+855[1-9][0-9]{7,8})$') , this.noSpacesValidator()]],
            email: ['', [Validators.required]],
            role_ids: [[], [Validators.required]], // Initialize as an empty array
        });
    }

    ngOnInit(): void {  
        this.data = this.datas.data; 
        this.path = this.datas.path;
        this._id = this.datas.id;
        this.src = `${this.fileUrl}${this.data?.avatar}`;
        

        this.firstFormGroup.patchValue({
            avatar: this.data?.avatar || '',
            name: this.data?.name || '',
            phone: this.data?.phone || '',
            email: this.data?.email || '',
            role_ids: this.data?.role_ids || [], // Ensure it's an array
            sex_id: this.data?.sex_id || '',
        });

        this.roleIds.valueChanges.subscribe(selectedRoles => {
            console.log('Selected Roles:', selectedRoles);
        });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    selectCoverFile(): void {
        const fileInput = document.getElementById('portrait-fileCover') as HTMLInputElement;
        fileInput.click();
    }

    srcChange(base64: string): void {
        this.src = base64;
        this.firstFormGroup.get('avatar').setValue(base64);
    }

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = e.target.result;
                this.srcChange(base64);
            };
            reader.readAsDataURL(file);
        }
    }

    chosenDobHandler(event: any) {
        const date = event._d;
        this.firstFormGroup.get('dob').setValue(moment(date).format('YYYY-MM-DD'));
    }

    onSubmit(): void {
        const body = this.firstFormGroup.value;
        
        this._service.updateStaff(this._id, body).subscribe({
          next: res => {
            this.data = res.data;
            this._snackBarService.openSnackBar("ធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ", GlobalConstants.success);
            this.dialogRef.close(this.data);
          },
          error: err => {
              let message: string = err.error.message ?? GlobalConstants.genericError;
              this._snackBarService.openSnackBar(message, GlobalConstants.error);
          }
        });
    }
}
