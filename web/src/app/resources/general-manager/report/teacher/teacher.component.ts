// ================================================================>> Core Library
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// ================================================================>> Third-Party Library
import { MatTabContent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';

import { FormBuilder,  FormsModule, ReactiveFormsModule} from '@angular/forms';
// ================================================================>> Custom Library Librarys

import { MatIconModule } from '@angular/material/icon';
import { helperAnimations } from 'helper/animations';
import { env } from 'envs/env';
import { MatCommonModule } from '@angular/material/core';
import { HelperBarChartComponent } from 'helper/components/bar-chart/bar-chart.component';
import { HelperSemiPieChartComponent } from 'helper/components/semi-piechart/semi-piechart.component';
import { HelperMultipleBarChartComponent } from 'helper/components/multiple-bar-chart/multiple-bar-chart.component';
import { HelperLineChartComponent } from 'helper/components/line-chart/line-chart.component';
import { HelperPieChartComponent } from 'helper/components/pie-chart/pie-chart.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatTableModule } from '@angular/material/table';
import { HelperLineChartComponentV2 } from 'helper/components/line-chart v2/line-chart.component';
import { ReportTeacherService } from './teacher.service';
import { AcademicYear, BranchTotal } from './teacher.type';

@Component({
    selector: 'general-manager-report-teacher',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatCommonModule,
        MatTabsModule,
        MatTableModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabContent,
        MatButtonToggleModule,
        HelperBarChartComponent,
        HelperLineChartComponentV2
    ],
    templateUrl: './teacher.component.html',
    styleUrl: './teacher.component.scss'
})
export class ReportTeacherComponent {
    public data: AcademicYear[];
    public branch: BranchTotal[];
    public total_teachers: number;
    public total_female_teachers: number;
    public total_male_teachers: number;
    public filteredData: AcademicYear[]; 
    public selectedFilter: string = 'សរុប';
    // for line chart

    xAxisCategories = [];
    lineChartData = [];

    // ================================================================>> varable for sevice
    public id: number;
    fileUrl: string = env.FILE_BASE_URL
    // ================================================================>> full price for other payment
    public otherPaymentFullPrice: number = 0;
    fullPriceDollar: number = 0;
    fullPriceKHR: number = 0;
    public exchange_rate: any[];


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _service: ReportTeacherService,
    private _snackbarService: SnackbarService,  
  ) 
  {

  }
    
  
  ngOnInit(): void {
    this.listing();
  }

    
    listing(): void {
        this._service.listing().subscribe({
            next: res => {
                this.data = res.data;
                this.branch = res.branchTotals;
                this.total_teachers = res.overallTotalTeachers;
                this.total_female_teachers = res.totalFemaleTeachers;
                this.total_male_teachers = res.totalMaleTeachers

                this.updateXAxisCategories(res.data);
                this.updateLineChartData(res.data);
            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    updateXAxisCategories(academicYears: any[]): void {
        this.xAxisCategories = academicYears.map(year => year.academic_name);
        // Log the updated xAxisCategories to verify
        console.log(this.xAxisCategories);
    }
      

    updateLineChartData(academicYears: any[]): void {
        // Initialize lineChartData with branch names and empty data arrays
        const updateData = this.branch.map(branch => ({
            name: branch.branch_name, // Each branch's name
            data: [] // Initialize an empty data array for each branch
        }));
    
        academicYears.forEach(academicYear => {
            updateData.forEach(branchData => {
                // Find the corresponding branch in the academicYear's branches
                const branch = academicYear.branches.find(b => b.branch_name === branchData.name);
                if (branch) {
                    if (this.selectedFilter === 'សរុប') {
                        branchData.data.push(branch.n_teacher); // Add the total student count for this branch
                    }else if(this.selectedFilter === 'ប្រុស'){
                        branchData.data.push(branch.n_male_teacher);
                    }else{
                        branchData.data.push(branch.n_female_teacher);
                    }
                } else {
                    branchData.data.push(0); // If no branch found, push 0
                }
            });
        });

        this.lineChartData = updateData;
    }    


    updateValue(selectedValue: string): void {
        console.log("Selected value:", selectedValue);
        this.selectedFilter = selectedValue;
        this.updateLineChartData(this.data);
    }
}
