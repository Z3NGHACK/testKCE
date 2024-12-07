import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { ClassroomService } from '../../../class.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { env } from 'envs/env';

@Component({
    selector: 'add-student-create-principal',
    standalone: true,
    templateUrl: './add-student.component.html',
    styleUrls: ['./add-student.component.scss'],
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        FormsModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatDialogModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatCheckbox,
    ],
})
export class AddStudentCreateComponent {
    public form: FormGroup;
    fileUrl: string = env.FILE_BASE_URL;
    search: string = ''; // Search term for filtering students
    selectedStudents: any[] = []; // Array to store selected students
    filterStudents: any[] = []; // Filtered student list

    constructor(
        public dialogRef: MatDialogRef<AddStudentCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, // Inject data from the parent component
        private _formBuilder: FormBuilder,
        private _snackBarService: SnackbarService,
        private _classroomService: ClassroomService
    ) {
        this.form = this._formBuilder.group({
            student_ids: [[], [Validators.required]], // Add validation to ensure selection
        });
    }

    ngOnInit(): void {
        // Initialize students list with "check" property
        this.data.data.forEach((student) => {
            student.check = false;
        });
        this.filterStudents = this.data.data; // Set initial filtered list to the full list
    }

    // Close the dialog
    closeDialog(): void {
        this.dialogRef.close();
    }

    // Filter students based on the search input
    onFilter(): void {
        this.filterStudents = this.data.data.filter((student) =>
            student.name.toLowerCase().includes(this.search.toLowerCase())
        );
    }

    // Select or unselect a student
    onSelect(item: any): void {
        const index = this.selectedStudents.findIndex(
            (student) => student.id === item.id
        );

        if (index === -1) {
            // Add student if not selected
            this.selectedStudents.push(item);
        } else {
            // Remove student if already selected (toggle)
            this.selectedStudents.splice(index, 1);
        }

        // Sync the checkbox state with the selected array
        item.check = index === -1;
    }

    // Submit the form with selected students
    onSubmit(): void {
        if (this.selectedStudents.length > 0) {
            // Prepare student_ids to send in the form
            this.form.patchValue({
                student_ids: this.selectedStudents.map((student) => student.id),
            });

            console.log('Selected student IDs:', this.form.value.student_ids);

            // You can uncomment and adapt the API call below to create a classroom with selected students:
            this._classroomService
                .addStudent(this.data.id, this.form.value.student_ids)
                .subscribe({
                    next: (res) => {
                        this.dialogRef.close(res.students);
                        this._snackBarService.openSnackBar(
                            res.message,
                            GlobalConstants.success
                        );
                    },
                    error: (err) => {
                        this._snackBarService.openSnackBar(
                            err.error.message || GlobalConstants.genericError,
                            GlobalConstants.error
                        );
                    },
                });
        } else {
            // Show an error if no students are selected
            this._snackBarService.openSnackBar(
                'សូមជ្រើសរើសសិស្សមុនពេលបញ្ជូន',
                GlobalConstants.error
            );
        }
    }
}
