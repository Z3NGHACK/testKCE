import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, EventEmitter , Input, input, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassroomDetailComponent } from '../../../dialog/student-classroom-detail/student-classroom-detail.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Classrooms } from '../../teacher.types';
import { Router } from '@angular/router';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { SharedTeacherService } from '../../teacher.service';
import { SharedViewClassroomComponent } from './view/view.component';

@Component({
    selector: 'shared-view-teacher-classroom',
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
export class TeacherClassroomComponent {
    key: string = '';
    branch_id: number = 0;
    hideMultipleSelectionIndicator = signal(true);
    public isloading = false;  
   
    @Input() path!: 'principal' | 'general-manager';
    @Input() id!: number;

    @Input() data: Classrooms[] = [];
    
    public primary_data: Classrooms[]= [];
    public primary_display_data: Classrooms[]= [];

    public secondary_data: Classrooms[]= [];
    public secondary_display_data: Classrooms[]= [];

    public Kindergarten_data: Classrooms[] = [];
    public Kindergarten_display_data: Classrooms[] = [];

    public high_data: Classrooms[] = [];
    public high_display_data: Classrooms[] = [];

 
    constructor(
        private _router: Router,
        private _classroomService: SharedTeacherService,
        private _snackbarService: SnackbarService,
        private _cdref: ChangeDetectorRef,
        private _matDialog: MatDialog
    ) {
        
    }
    
    ngOnInit(): void {
        // this.listing();
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
       
    }

    listing(): void {
        this._classroomService.view(this.path , this.id ).subscribe({
            next: res => {
                
                this.data = res.classrooms;
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


    view(data: Classrooms): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data =  {data , path: this.path} ;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
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
