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
import { ReportTeacherService } from '../teacher/teacher.service';
import { AcademicYear, BranchTotal } from '../teacher/teacher.type';
import { FinanceTeacherService } from './finance.service';
import { AcademicYearData, BranchInvoices } from './finance.type';

@Component({
    selector: 'general-manager-report-finance',
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
    templateUrl: './finance.component.html',
    styleUrl: './finance.component.scss'
})
export class ReportFinanceComponent {
    public data: AcademicYearData[];
    public branch: BranchInvoices[];
    // public total_teachers: number;
    // public total_female_teachers: number;
    // public total_male_teachers: number;
    public filteredData:  AcademicYearData[]; 
    public selectedFilter: string = 'ដុល្លារ';
    // for line chart
    total_invoices: number;
    total_invoices_in_riels: number;

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
    private _service: FinanceTeacherService,
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
                // console.log(this.data)
                this.branch = res.total_invoices;
                this.total_invoices = res.total_finance;
                this.total_invoices_in_riels = res.total_finance_in_riels;
                // this.total_female_teachers = res.totalFemaleTeachers;
                // this.total_male_teachers = res.totalMaleTeachers

                this.updateXAxisCategories(res.data);
                this.updateLineChartData(res.data);
            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    updateXAxisCategories(academicYears: any[]): void {
      // Reverse the academicYears array and map it to academic_name
      this.xAxisCategories = academicYears.map(year => year.academic_name).reverse();
      // Log the updated xAxisCategories to verify
      console.log(this.xAxisCategories);
  }
  
  updateLineChartData(academicYears: any[]): void {
    // Initialize lineChartData with branch names and empty data arrays
    const initialLineChartData = this.branch.map(branch => ({
        name: branch.branch_name, // Each branch's name
        data: [] // Initialize an empty data array for each branch
    }));

    // Reverse the academicYears array if needed
    academicYears.forEach(academicYear => {
        initialLineChartData.forEach(branchData => {
            // Find the corresponding branch in the academicYear's branches
            const branch = academicYear.branches.find(b => b.branch_name === branchData.name);
            if (branch) {
                // Push the corresponding value based on the selected filter
                if (this.selectedFilter === 'រៀល') {
                    branchData.data.push(branch.total_invoices_in_riels); // Use total_invoices_in_riels for riels
                } else {
                  branchData.data.push(branch.total_invoices); // Use total_invoices for dollars
                }
            } else {
                branchData.data.push(0); // If no branch found, push 0
            }
        });
    });

    // Assign the initialized data to the class property
    this.lineChartData = initialLineChartData;

    // Log the final output for debugging
    console.log(this.lineChartData);
}



  
  updateValue(selectedValue: string): void {
    // console.log("Selected value:", selectedValue);
    this.selectedFilter = selectedValue;
    this.updateLineChartData(this.data);
  }
  
}
