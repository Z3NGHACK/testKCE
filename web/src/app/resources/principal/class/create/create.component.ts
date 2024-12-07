import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { General } from 'app/shared/teacher/teacher.types';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClassroomService } from '../class.service';
import { AcademicsResponse } from '../classroom.type';

const moment = _moment;

@Component({
    selector: 'classroom-create-principal',
    standalone: true,
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    imports: [
        MatIconModule,
        PortraitComponent,
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatSelectModule,
        MatButtonModule,
    ],
})
export class PrincipalClassroomCreateComponent {
    fileUrl: string = env.FILE_BASE_URL;
    src: string;
    public firstFormGroup: FormGroup;
    private _id: number;
    public data: AcademicsResponse ;

    filteredGrades: any[] = [];
    public isGradeDisabled: boolean = true; 

    constructor(
        public dialogRef: MatDialogRef<PrincipalClassroomCreateComponent>,
        // @Inject(MAT_DIALOG_DATA) public datas: { data: General , id: number , path: 'principal' | 'general-manager' },
        private _formBuilder: FormBuilder,
        private _snackBarService: SnackbarService,
        private _classroomService: ClassroomService,
    ) {
        this.firstFormGroup = this._formBuilder.group({
            level_id: [null, [Validators.required]],
            academic_branch_id: [null, [Validators.required]],
            grade_id: [null, [Validators.required]],
            room_id: [null, [Validators.required]],
            teacher_id: [null, [Validators.required]],
            language_id: [null, [Validators.required]],
            schedule_id: [null, [Validators.required]],
        });
        
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.setup(); 
        }, 1); 
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    selectCoverFile(): void {
        const fileInput = document.getElementById('portrait-fileCover') as HTMLInputElement;
        fileInput.click();
    }

    setup(){
        this._classroomService.setup( ).subscribe({
            next: res => {
                this.data = res; 
                console.log(this.data)
                this.filteredGrades = this.data.grades; 
                // Check if 'res' and 'res.classroom' are defined
            },
            error: err => {
                this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }
    onLevelSelectionChange(event: any): void {
        const selectedLevelId = event.value;

        // Manual filtering logic for grades based on selected level
        if (selectedLevelId === 1) {
            // Filter for level 1 (មត្តេយ្យ)
            this.filteredGrades = this.data.grades.filter(grade => ['K3', 'K4', 'K5'].includes(grade.name));
        } else if (selectedLevelId === 2) {
            // Filter for level 2 (បឋមសិក្សា) - from grade "ទី ១" to "ទី ៦"
            this.filteredGrades = this.data.grades.filter(grade => ['ទី​ ១', 'ទី​ ២', 'ទី​ ៣', 'ទី​ ៤', 'ទី​ ៥', 'ទី​ ៦'].includes(grade.name));
        } else if (selectedLevelId === 3) {
            // Filter for level 3 (អនុវិទ្យាល័យ) - from grade "ទី​ ៧" to "ទី​ ៩"
            this.filteredGrades = this.data.grades.filter(grade => ['ទី​ ៧', 'ទី​ ៨', 'ទី​ ៩'].includes(grade.name));
        } else if (selectedLevelId === 4) {
            // Filter for level 4 (វិទ្យាល័យ) - from grade "ទី​ ១០" to "ទី​ ១២"
            this.filteredGrades = this.data.grades.filter(grade => ['ទី​ ១០', 'ទី​ ១១', 'ទី​ ១២'].includes(grade.name));
        } else {
            // If no valid level is selected or 'All' is selected, show all grades
            this.filteredGrades = this.data.grades;
        }
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
        // console.log(this.firstFormGroup.value)
        this._classroomService.createClassroom(body).subscribe({
          next: res => {
            this.data = res.data;
            this.dialogRef.close(this.data);
            this._snackBarService.openSnackBar("ការបង្កើតទទួលបានជោគជ័យ", GlobalConstants.success);
           
          },
          error: err => {
              let message: string = err.error.message ?? GlobalConstants.genericError;
              this._snackBarService.openSnackBar(message, GlobalConstants.error);
          }
        });
    }
}
