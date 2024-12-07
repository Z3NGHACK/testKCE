import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Inject, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { SharedStudentService } from "app/shared/student/student.service";
import { General, View } from "app/shared/student/student.types";
import { PortraitComponent } from "helper/components/portrait/portrait.component";
import { SnackbarService } from "helper/services/snack-bar/snack-bar.service";
import { GlobalConstants } from "helper/shared/constants";


@Component({
    selector: 'shared-payment-view',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
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
        MatTabGroup,
        MatProgressSpinnerModule
    ],
})
export class ParentViewInvoiceComponent implements OnInit, OnChanges {

    private _id: number;
    // public loading:boolean=false;
    @Output() dialogClosed = new EventEmitter<void>();
    disable = false;
    constructor(
        private _snackbarService: SnackbarService,
        private _studentService: SharedStudentService,
        public dialogRef: MatDialogRef<ParentViewInvoiceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
    ) { }


    ngOnInit(): void {

        this._id = this.data.id;

    }
    ngOnChanges(changes: SimpleChanges): void {
    }
    ngAfterViewInit() {

    }
    closeDialog(data: any = null): void {
        this.dialogRef.close(data);
    }
    updatePayment() {
        this.disable = true;
        this._studentService.updateInvoice(this._id).subscribe({
            next: res => {
                this._snackbarService.openSnackBar("ទូទាត់បានជោគជ័យ", GlobalConstants.success);
                // this.dialogClosed.emit(res);
                this.closeDialog(res);
            }
        })
    }
    transform(value: string | number): string {
        const phone = value.toString();

        // Apply phone number formatting (e.g., 096 517 578)
        return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    round(data) {
        return Math.round((data?.price * data?.rate?.number) / 100) * 100;
    }


}
