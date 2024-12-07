import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { General, View } from "app/shared/student/student.types";
import { PortraitComponent } from "helper/components/portrait/portrait.component";


@Component({
    selector: 'shared-payment-create-invoice',
    standalone: true,
    templateUrl: './create-invoice.component.html',
    styleUrls: ['./create-invoice.component.scss'],
    imports: [
        MatTabsModule,
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabGroup
    ],
})
export class SharedCreateInvoiceComponent {

    public data: General;

    private _id: number;

    constructor(
        public dialogRef: MatDialogRef<SharedCreateInvoiceComponent>,
        @Inject(MAT_DIALOG_DATA) public datas:any,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.data = this.datas.row;
        this._id = this.datas.id;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    update(row:any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { row, id: this._id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const updateDialogRef = this._matDialog.open(SharedCreateInvoiceComponent, dialogConfig);

        updateDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.data = result; // Update details with new data
                this.closeDialog()
            }
        });
    }
}
