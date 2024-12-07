import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { env } from 'envs/env';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { ReceptionistService } from 'app/resources/receptionist/receptionist.service';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { SettingService } from '../../setting.service';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
    selector: 'principle-seeting-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        TextFieldModule,
        MatOptionModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatExpansionModule,
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
})
export class CreateRoomComponent {
    room: UntypedFormGroup;
    constructor(
        public dialogRef: MatDialogRef<CreateRoomComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly _formBuilder: UntypedFormBuilder,
        private _snackBarService: SnackbarService,
        private service: SettingService
    ) {
        this.ngBuilderForm();
    }
    ngOnInit(): void {}
    ngBuilderForm(): void {
        this.room = this._formBuilder.group({
            name: [
                this.data.item ? this.data.item.name : '',
                [Validators.required],
            ],
            building_name: [
                this.data.item ? this.data.item.building_name : '',
                [Validators.required],
            ],
            floor: [
                this.data.item ? this.data.item.floor : '',
                [Validators.required],
            ],
            description: [
                this.data.item ? this.data.item.description : '',
                [Validators.required],
            ],
        });
    }
    submit(): void {
        this.room.disable();
        if (this.data.item) {
            this.service
                .updateRoom(this.data.item.id, this.room.value)
                .subscribe({
                    next: (res) => {
                        this.room.enable();
                        this.dialogRef.close(res.data);
                        this._snackBarService.openSnackBar(
                            res.message,
                            GlobalConstants.success
                        );
                    },
                    error: (err) => {
                        this.room.enable();
                        let message: string =
                            err.error.message ?? GlobalConstants.genericError;
                        this._snackBarService.openSnackBar(
                            message,
                            GlobalConstants.error
                        );
                    },
                });
        } else {
            this.service.createRoom(this.room.value).subscribe({
                next: (res) => {
                    this.room.enable();
                    this.dialogRef.close(res.data);
                    this._snackBarService.openSnackBar(
                        res.message,
                        GlobalConstants.success
                    );
                },
                error: (err) => {
                    this.room.enable();
                    let message: string =
                        err.error.message ?? GlobalConstants.genericError;
                    this._snackBarService.openSnackBar(
                        message,
                        GlobalConstants.error
                    );
                },
            });
        }
    }
    closeDialog(): void {
        this.dialogRef.close();
    }
}
