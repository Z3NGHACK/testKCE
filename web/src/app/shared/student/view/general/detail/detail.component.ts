import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { View } from '../../../student.types';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SharedStudentUpdateComponent } from '../update/update.component';
import { General } from '../../../student.types';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedUpdateParentComponent } from '../update-parent/update-parent.component';
import { CreateParentComponent } from 'app/resources/receptionist/student/create/create-parent/component';

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
export class SharedStudentDetailsComponent {
    fileUrl: string = env.FILE_BASE_URL;
    public data: General;

    private _id: number;
    constructor(
        public dialogRef: MatDialogRef<SharedStudentDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public datas: { row: View['general'], id: number, path: string },
        private _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.data = this.datas.row;
        this._id = this.datas.id;
    }

    closeDialog(): void {
        this.dialogRef.close(this.data);

    }

    update(row: View['general']): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { row, id: this._id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const updateDialogRef = this._matDialog.open(SharedStudentUpdateComponent, dialogConfig);

        updateDialogRef.afterClosed().subscribe(result => {
            if (result) {
                // this.data = result; // Update details with new data
                this.data.avatar = result.avatar;
                this.data.en_name = result.en_name;
                this.data.kh_name = result.kh_name;
                this.data.dob = result.dob;
                this.data.pob = result.pob;
                this.data.sex_id = result.sex_id;
                this.data.sex= result.sex_id == 1? 'ប្រុស':'ស្រី'
            }
        });
    }
    updateParent(row: View['general']): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { row, id: this._id, path: this.datas.path };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const updateDialogRef = this._matDialog.open(SharedUpdateParentComponent, dialogConfig);

        updateDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.data?.parents.forEach((p) => {

                    if (p.id == result.id) {
                        p.address = result.address
                        p.email = result.email
                        p.facebook = result.facebook
                        p.job = result.job
                        p.name = result.name
                        p.phone1 = result.phone1
                        p.phone2 = result.phone2
                        p.relation = result.relation
                        p.telegram = result.telegram

                    }
                })
            }
        });
    }
    createParentDialog(): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            parents:null,
            id:this._id,
            part:"general"
        };
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        const dialogRef = this._matDialog.open(
            CreateParentComponent,
            dialogConfig
        );
        dialogRef.componentInstance.createParent.subscribe((response: any) => {
            this.data.parents.unshift(response)

        });
    }



}
