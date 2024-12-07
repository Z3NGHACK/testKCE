// ================================================================>> Core Library
import { Component, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// ================================================================>> Third-Party Library
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { GlobalConstants } from 'helper/shared/constants';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';

// ================================================================>> Custom Library Librarys

import { MatIconModule } from '@angular/material/icon';
import { helperAnimations } from 'helper/animations';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { General, View } from '../../student.types';
import { SharedStudentDetailsComponent } from './detail/detail.component';
import { SharedStudentService } from '../../student.service';
import { SharedViewInvoiceComponent } from '../payment/view-invoice/view-invoice.component';
import { firstValueFrom } from 'rxjs';


@Component({
    selector: 'shared-view-student-general',
    standalone: true,
    imports: [
        MatTabsModule,
        MatIconModule,
        PortraitComponent,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDialogModule,
        CommonModule,
        FormsModule,
        MatTableModule,
        MatExpansionModule,
        MatRadioModule,
        MatMenuModule,
        MatInputModule,
        ReactiveFormsModule,
        MatCheckboxModule,

    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss'
})
export class StudentGeneralComponent {
    @Input() data: any;
    @Input() path: 'receptionist' | 'general-manager';
    fileUrl: string = env.FILE_BASE_URL;
    @Input() id: number
    @Output() dialogClosed = new EventEmitter<void>();

    public dataSource: any[];
    displayedColumns: string[] = [
        'code',
        'total_price',
        'receiver',
        'date',
        'payment_status',
        'action',
    ];
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _matDialog: MatDialog,
        private _snackbarService: SnackbarService,
        private _formBuilder: FormBuilder,
        private _studentService: SharedStudentService,
    ) {

    }

    ngOnInit(): void {
        this.dataSource = this.data?.payment?.invoices;
    }

    viewdetail(row: View['general']): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { row, id: this.id, path: this.path };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef: MatDialogRef<SharedStudentDetailsComponent> = this._matDialog.open(SharedStudentDetailsComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                
            }
            // this.dialogClosed.emit();
        });
    }

    async viewPayment(item): Promise<void> {
        let res: any;

        // Convert the observable to a promise using firstValueFrom
        try {
            res = await firstValueFrom(this._studentService.viewInvoice(item.id));
        } catch (error) {
            console.error('Error fetching invoice:', error);
            return; // Exit if there is an error
        }

        // Proceed to open the dialog with the retrieved data
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {data: res.data , path: this.path }; // Pass the data to the dialog
        
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(SharedViewInvoiceComponent, dialogConfig);

        // Handle the dialog result
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.data.invoices.forEach(item => {
                    if (result.id == item.id) {
                        item.status.id = 2
                        item.status.name = "បានទូទាត់";
                    }
                });
                this.dataSource = this.data.invoices;
            }
        });
    }


}
