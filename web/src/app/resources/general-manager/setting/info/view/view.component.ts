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
// import { General } from '../../../staff.type';
// import { StaffService } from '../../../staff.service';
import { env } from 'envs/env';
import { GMStaffUpdateComponent } from '../update/update.component';
import { StaffUpdatePasswordComponent } from '../update-password/update-password.component';
// import { StaffUpdateComponent } from '../update/update.component';
// import { StaffUpdatePasswordComponent } from '../update-password/update-password.component';



@Component({
    selector: 'GM-staff-view-detail',
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
        ReactiveFormsModule
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss'
})

export class ViewComponent {
    @Output() updateData: EventEmitter<any> = new EventEmitter<any>();

    public data: any;
    public id: number;
    fileUrl: string = env.FILE_BASE_URL;

    constructor(
        public dialogRef: MatDialogRef<ViewComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: any,
        private _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
      this.data = this.datas;
        // this.data = this.datas.row;
        // this.id = this.datas.id;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    updatePassword(item: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data =  item
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        this._matDialog.open(StaffUpdatePasswordComponent, dialogConfig);
    
    }

    update(data: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = data
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef: MatDialogRef<GMStaffUpdateComponent> = this._matDialog.open(GMStaffUpdateComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.data = result;
            this.updateData.emit(result);
          }
        });
      }
}
