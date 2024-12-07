import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
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
import { GlobalConstants } from 'helper/shared/constants';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { General } from '../../../staff.type';
import { StaffService } from '../../../staff.service';
import { env } from 'envs/env';
import { StaffUpdateComponent } from '../update/update.component';
import { StaffUpdatePasswordComponent } from '../update-password/update-password.component';



@Component({
    selector: 'principle-employee-view-detail',
    standalone: true,
    imports: [
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss'
})

export class ViewEmployeeDetailComponent {
    @Output() updateData: EventEmitter<General> = new EventEmitter<General>();

    public data: General;
    public id: number;
    fileUrl: string = env.FILE_BASE_URL;

    constructor(
        public dialogRef: MatDialogRef<ViewEmployeeDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: { row: General, id: number },
        private _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.data = this.datas.row;
        this.id = this.datas.id;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    updatePassword(data: General): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { data, id: this.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        this._matDialog.open(StaffUpdatePasswordComponent, dialogConfig);
    
    }

    

    update(data: General): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { data, id: this.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef: MatDialogRef<StaffUpdateComponent> = this._matDialog.open(StaffUpdateComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.data = result;
            this.updateData.emit(result); // Emit the updated data
          }
        });
      }
}
