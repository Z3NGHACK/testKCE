import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedStudentService } from 'app/shared/student/student.service';
import { MatRadioModule } from '@angular/material/radio';


@Component({
    selector: 'filter-student',
    standalone: true,
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
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
        MatProgressSpinnerModule,
        MatRadioModule,
    ],
})
export class FilterStudentComponent {
    loading: boolean = true;
    categories: any[] = [];
    filter: UntypedFormGroup;
    attechment = new EventEmitter();
    img: string = '';
    type: string = 'image';
    levels:any[]=[];
    grades:any[]=[];
    constructor(
        public dialogRef: MatDialogRef<FilterStudentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
        private _snackBarService: SnackbarService,
        private _service: SharedStudentService,
        private readonly _formBuilder: UntypedFormBuilder,
    ) {

    }
    ngOnInit(): void {

        this.ngBuilderForm();
        this.grades=this.data.setup.levels.find(f=> f.id == this.filter.get('level_id').value).grades;
        if(this.grades.length == 0){
            this.filter.get('grade_id').disable();
        }
    }

    ngBuilderForm(): void {
        this.filter = this._formBuilder.group({
            level_id: [this.data.param.level_id, []],
            grade_id: [this.data.param.grade_id, []],
            sex_id: [this.data.param.sex_id, []],
        });
    }
    onChnageLevel(){
        this.grades=this.data.setup.levels.find(f=> f.id == this.filter.get('level_id').value).grades;
        this.filter.get('grade_id').setValue('');
        this.filter.get('grade_id').enable();
    }
    clear(){
        this.filter.get('grade_id').setValue('');
        this.filter.get('level_id').setValue('');
        this.filter.get('sex_id').setValue('');
    }
    submit(): void {
        this.dialogRef.close(this.filter.value);
    }






    closeDialog(): void {
        this.dialogRef.close();
    }
}
