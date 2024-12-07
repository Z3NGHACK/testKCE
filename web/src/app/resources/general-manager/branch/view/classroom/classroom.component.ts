import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, EventEmitter , Input, input, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { Router } from '@angular/router';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { Classroom } from '../../branch.type';
import { BranchService } from '../../branch.service';
import { SharedViewClassroomComponent } from 'app/shared/teacher/view/classroom/view/view.component';


@Component({
    selector: 'general-manager-classroom',
    standalone: true,
    imports: [
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonToggleModule,
        MatMenuModule,
        MatButtonModule,
        CommonModule
    ],
    templateUrl: './classroom.component.html',
    styleUrl: './classroom.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchClassroomComponent {
    
    
    key: string = '';
    branch_id: number = 0;
    hideMultipleSelectionIndicator = signal(true);
    public isloading = false;  
   
    @Input() path!: 'principal' | 'general-manager';
    @Input() id!: number;

    public data: Classroom[] = [];
    
    public primary_data: Classroom[]= [];
    public primary_display_data: Classroom[]= [];

    public secondary_data: Classroom[]= [];
    public secondary_display_data: Classroom[]= [];

    public Kindergarten_data: Classroom[] = [];
    public Kindergarten_display_data: Classroom[] = [];

    public high_data: Classroom[] = [];
    public high_display_data: Classroom[] = [];

 
    constructor(
        private _router: Router,
        private _classroomService: BranchService,
        private _snackbarService: SnackbarService,
        private _cdref: ChangeDetectorRef,
        private _matDialog: MatDialog
    ) {
        
    }
    
    ngOnInit(): void {
        this.listing();
       
    }

    listing(): void {

        const param: { month?: string , income_month?: string ,primary_income_month?: string } = {};

        // if (this.firstFormGroup.get('month').value != '') {
        //     param.month = this.firstFormGroup.get('month').value;
        // }

        
        // if (this.firstFormGroup.get('primary_income_month').value != '') {
        //     param.primary_income_month = this.firstFormGroup.get('primary_income_month').value;
        // }

        // if (this.firstFormGroup.get('income_month').value != '') {
        //     param.income_month = this.firstFormGroup.get('income_month').value;
        // }
        this._classroomService.view(this.id, param).subscribe({
            next: res => {
                
                this.data = res.classroom;
                // Check if 'res' and 'res.classroom' are defined
                if (this.data) {
                    // Filter classrooms based on 'level_name'
                    this.primary_data = this.data.filter(classroom => classroom.level_name === 'បឋមសិក្សា');
                    this.primary_display_data = this.primary_data;

                    this.secondary_data = this.data.filter(classroom => classroom.level_name === 'អនុវិទ្យាល័យ');
                    this.secondary_display_data = this.secondary_data;

                    this.Kindergarten_data = this.data.filter(classroom => classroom.level_name === 'មត្តេយ្យ');
                    this.Kindergarten_display_data = this.Kindergarten_data;

                    this.high_data = this.data.filter(classroom => classroom.level_name === 'វិទ្យាល័យ');
                    this.high_display_data = this.high_data;
                    
                    this._cdref.detectChanges();
                } else {
                    this.data = [];
                    this.primary_data = [];
                    this.Kindergarten_data = []
                    this.isloading = true
                }
                
                // this.view(this.data[0]);
                return
            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    getlanguage(status: string): string {
        switch (status) {
          case 'ខ្មែរ':
            return 'bg-blue-600';
          case 'អង់គ្លេស':
            return 'bg-blue-800';
          default:
            return 'bg-blue-400';
        }
      }

      toggleMultipleSelectionIndicator() {
        this.hideMultipleSelectionIndicator.update(value => !value);
    }


    view(data: Classroom): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data =  {data , path: 'general-manager'} ;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
        dialogConfig.hasBackdrop = true;
    
        this._matDialog.open(SharedViewClassroomComponent, dialogConfig);

    }
    // This will be triggered whenever a toggle is selected
    onLanguageChange(event: any): void {
        // Get the array of selected languages
        const selectedLanguages = event.value; 

        // Log the selected languages
        if (selectedLanguages.length === 0) {
            this.Kindergarten_display_data = this.Kindergarten_data;
        } else {
            // Filter classrooms that match any of the selected languages
            this.Kindergarten_display_data = this.Kindergarten_data.filter(classroom => 
                selectedLanguages.includes(classroom.language)
            );
        }
    }

    onLanguageChangePrimary(event: any): void {
        // Get the array of selected languages
        const selectedPrimaryLanguages = event.value;
        
        // Log the selected languages
        if (selectedPrimaryLanguages.length === 0) {
            this.primary_display_data = this.primary_data;
        } else {
           // Filter classrooms that match any of the selected languages
           this.primary_display_data = this.primary_data.filter(classroom => 
            selectedPrimaryLanguages.includes(classroom.language)
        );
        }
    }

    onLanguageChangeSecondary(event: any): void {
        // Get the array of selected languages
        const selectedSecondaryLanguages = event.value;   
        // Log the selected languagesz
        if (selectedSecondaryLanguages.length === 0) {
            this.secondary_display_data = this.secondary_data;
        } else {
           // Filter classrooms that match any of the selected languages
           this.secondary_display_data = this.secondary_data.filter(classroom => 
            selectedSecondaryLanguages.includes(classroom.language)
        );
        }
    }

    onLanguageChangeHigh(event: any): void {
        // Get the array of selected languages
        const selectedHighLanguages = event.value;   
        // Log the selected languagesz
        if (selectedHighLanguages.length === 0) {
            this.high_display_data = this.high_data;
        } else {
           // Filter classrooms that match any of the selected languages
           this.secondary_display_data = this.high_data.filter(classroom => 
            selectedHighLanguages.includes(classroom.language)
        );
        }
    }


   
    

}
