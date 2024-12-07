import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AcademicService } from '../../../academic.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule, MatTabContent } from '@angular/material/tabs';


@Component({
    selector: 'report-branch',
    standalone: true,
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss',
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
        MatExpansionModule,
        MatTabsModule,
        MatTabContent,
    ],
})
export class GMReportBranchDialog {
    loading: boolean = true;
    listing = [];
    constructor(
        public dialogRef: MatDialogRef<GMReportBranchDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBarService: SnackbarService,
        private _service: AcademicService,
    ) {

    }
    ngOnInit(): void {
        this.loading = true;
        this._service.report(this.data.id, this.data.item.branch_id).subscribe((res: any) => {
            this.listing = res.data;
            this.loading = false;
        })
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
