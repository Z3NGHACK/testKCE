import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { env } from 'envs/env';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeplerImgViewerComponent } from 'helper/components/img-viewer/img-viewer.component';
import { HeplerPdfViewerComponent } from 'helper/components/pdf-viewer/pdf-viewer.component';
import { SharedStudentService } from 'app/shared/student/student.service';


@Component({
    selector: 'shared-crate-file',
    standalone: true,
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
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
    ],
})
export class UploadFileComponent {
    loading: boolean = true;
    categories: any[] = [];
    attechmentForm: UntypedFormGroup;
    attechment = new EventEmitter();
    img:string='';
    type:string='image';
    constructor(
        public dialogRef: MatDialogRef<UploadFileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
        private _snackBarService: SnackbarService,
        private _service: SharedStudentService,
        private readonly _formBuilder: UntypedFormBuilder,
    ) {

    }
    ngOnInit(): void {
        console.log(this.data.id)
        this.ngBuilderForm();
    }

    ngBuilderForm(): void {
        this.attechmentForm = this._formBuilder.group({
            file: [null, [Validators.required]],
            title: [null, [Validators.required]],
            // mon_id: [this.data.data.data.data.id || null, [Validators.required]],
        });
    }
    submit(): void {
        this.attechmentForm.disable();
        const form = new FormData();
        form.append('name', this.attechmentForm.value.title);
        form.append('file',this.attechmentForm.value.file);

        this._service.attechment(this.data.id, form).subscribe({
            next: res => {

                this.attechmentForm.enable();

                this.dialogRef.close(res.data);
                this._snackBarService.openSnackBar(res.message, GlobalConstants.success);
            },
            error: err => {
                this.attechmentForm.enable();
                let message: string = err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
    selectFile(): void {

        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput && this.attechmentForm.enabled) {
            fileInput.click();
        }
    }

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            this.attechmentForm.get('file').setValue(file);
            const reader = new FileReader();

            reader.onload = (e: any) => {
                const base64 = e.target.result;
                this.img = base64; // Store the base64 data for viewing
            };

            // You can validate file type before reading
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                reader.readAsDataURL(file); // Convert file to base64
            } else {
                alert('Unsupported file type. Please select an image or PDF.');
            }
        }
    }

    viewFile(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            url: this.img, // Base64 string of the selected file
            title: '' // You can set this dynamically
        };

        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0px' };
        dialogConfig.height = '100dvh';
        dialogConfig.width = '100dvw';
        dialogConfig.maxWidth = '100dvw';
        dialogConfig.panelClass = 'custom-mat-dialog-full';
        dialogConfig.enterAnimationDuration = '0s';

        if (this.img) {
            // Open the appropriate viewer based on file type
            if (this.type === 'pdf') {
                this._matDialog.open(HeplerPdfViewerComponent, dialogConfig);
            } else {
                this._matDialog.open(HeplerImgViewerComponent, dialogConfig);
            }
        } else {
            alert('No file to view.');
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
