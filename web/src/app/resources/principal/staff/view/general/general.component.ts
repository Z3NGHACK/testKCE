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
import { General } from '../../staff.type';
import { StaffService } from '../../staff.service';
import { SharedTeacherDetailsComponent } from 'app/shared/teacher/view/general/detail/detail.component';
import { ViewEmployeeDetailComponent } from './detail/detail.component';

@Component({
    selector: 'prinicple-view-employee-general',
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
export class ViewEmployeeGeneralComponent {
    @Output() UpdateName: EventEmitter<string> = new EventEmitter<string>();
    public data: General;
    fileUrl: string = env.FILE_BASE_URL;
    @Input() id: number
    // @Output() dialogClosed = new EventEmitter<void>(); 
    constructor(
        private _staffService: StaffService,
        private _snackbarService: SnackbarService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
      ) {
        
    }
    ngOnInit(): void {
        this.view();
        
       
    }
    view(): void {
        this._staffService.view(this.id).subscribe({
        next: res => {
            this.data = res.general; 
        },
        error: err => {
            this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        }
        
        });
    }
    
    viewdetail(row: General): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { row, id: this.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef: MatDialogRef<ViewEmployeeDetailComponent> = this._matDialog.open(ViewEmployeeDetailComponent, dialogConfig);
        dialogRef.componentInstance.updateData.subscribe(result => {
            if (result) {
                this.UpdateName.emit(result.name);
                this.data = result;
               
            }
          });
    }
}