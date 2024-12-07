import { Component, Inject, Output,EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { General } from 'app/shared/teacher/teacher.types';
import { SharedTeacherUpdateComponent } from '../update/update.component';


@Component({
    selector: 'shared-student-detail',
    standalone: true,
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
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
export class SharedTeacherDetailsComponent {
    @Output() updateData: EventEmitter<General> = new EventEmitter<General>();

    fileUrl: string = env.FILE_BASE_URL;
    public data: General;
    private _id: number;
    public path: 'principal' | 'general-manager';
    constructor(
        public dialogRef: MatDialogRef<SharedTeacherDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: { row: General , id: number , path: 'principal' | 'general-manager'},
        private _matDialog: MatDialog,
    ) {}

    ngOnInit(): void {  
        this.data = this.datas.row;
        this._id = this.datas.id;
        this.path = this.datas.path;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
    
    update(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { data: this.data, id: this._id , path: this.path};
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef: MatDialogRef<SharedTeacherUpdateComponent> = this._matDialog.open(SharedTeacherUpdateComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
           if(result){
                this.data = result;
                console.log(this.data)
                this.updateData.emit(result); // Emit the updated data
           }   
        });
    
    }

}
