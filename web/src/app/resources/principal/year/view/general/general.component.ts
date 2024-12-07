// ================================================================>> Core Library
import { ChangeDetectorRef, Component, EventEmitter, input, Input, OnInit, Output, signal } from '@angular/core';
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
import { HelperBarChartComponent } from 'helper/components/bar-chart/bar-chart.component';
import { HelperSemiPieChartComponent } from 'helper/components/semi-piechart/semi-piechart.component';
import { YearComponent } from '../../listing/year.component';
import { YearUpdateComponent } from './udpate/update.component';
import { AcademicService } from '../../academic.service';
import { General } from '../../academic.type';


@Component({
    selector: 'view-year-general-principal',
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
        HelperSemiPieChartComponent
        
    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss'
})
export class PrinicpalGeneralComponent {
    
    public value = '';
    public semi_chart: any[] = [];

    public data: General;
    fileUrl: string = env.FILE_BASE_URL;

    public male_student: any;

    @Input() id: number
    @Output() dialogClosed = new EventEmitter<void>(); 
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _matDialog: MatDialog,
        private _snackbarService: SnackbarService,
        private _academicService: AcademicService,
        private _formBuilder: FormBuilder,
        private cd: ChangeDetectorRef 
      ) {
  
    }

    ngOnInit(): void {
        this.view();
        console.log(this.male_student);
        // this.semi_chart = [
        //     { value: 12 , name: 'បុរស ' },  
        //     { value: 13, name: 'ស្ត្រី ' },  
        // ];
      
     
    }


       
    update(): void {
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data = { row, id: this._id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const updateDialogRef = this._matDialog.open(YearUpdateComponent, dialogConfig);
        
    }

    formatKhmerDateRange(fromDate: string): string {
        const khmerMonths = [
            'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
            'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
        ];
        
        const from = new Date(fromDate);
        
        const Month = khmerMonths[from.getUTCMonth()];
        const Year = from.getUTCFullYear();
    
        return `${Month} ${Year}`;
    }


   

    view(): void {
        this._academicService.view(this.id).subscribe({
            next: res => {
                this.data = res.general;
                this.male_student = this.data.n_student - this.data.female_student_count;
    
                // Ensure this data is set correctly
                this.value = `${this.data?.n_student} សិស្ស`

                this.semi_chart = [  
                    { value: this.data?.n_student - this.data?.female_student_count, name: 'បុរស ' },
                    { value: this.data?.female_student_count, name: 'ស្ត្រី' }
                ]

                // Log to verify data
                console.log('Updated semi_chart:', this.semi_chart);
                  

            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }
    
}
