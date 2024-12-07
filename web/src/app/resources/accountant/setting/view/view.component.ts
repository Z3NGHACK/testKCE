import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedStudentService } from 'app/shared/student/student.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { Bank } from '../setting.type';
import { UpdateBankComponent } from '../update/update.component';

@Component({
    selector: 'view-bank-detail',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
    imports: [
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule
    ],
})
export class BankDetailsComponent {
    @Output() updateData: EventEmitter<Bank> = new EventEmitter<Bank>();
    fileUrl: string = env.FILE_BASE_URL;
    public data: Bank;
    private _id: number;

    constructor(
        public dialogRef: MatDialogRef<BankDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: { row: Bank},
        private _matDialog: MatDialog,
        private _service: SharedStudentService,
        private _snackbarService: SnackbarService
    ) {}

    ngOnInit(): void {  
        this.data = this.datas.row;
        // this._id  = this.datas.id;
        // this.path = this.datas.path;
        // this.parents = this.datas.row?.parents;
    }

    closeDialog(): void {
        this.dialogRef.close();
        
    }


    
    update(row: Bank): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { row };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(UpdateBankComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.data = result;
                this.updateData.emit(result); 
            }   
         });
    }
    
}
