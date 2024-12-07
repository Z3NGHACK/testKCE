import { Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { HelperBarChartComponent } from 'helper/components/bar-chart/bar-chart.component';
import { DataResponse, FormattedUser, Invoice, Student } from './dashbord.type';
import { GlobalConstants } from 'helper/shared/constants';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { DashbordService } from './dashbord.service';
import { env } from 'envs/env';
import { CommonModule } from '@angular/common';
import { HelperSemiPieChartComponent } from 'helper/components/semi-piechart/semi-piechart.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import _moment, { Moment, months } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'app/resources/general-manager/year/view/general/update/update.component';

const moment = _moment;


@Component({
    selector: 'principal-dashboard',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        HelperBarChartComponent,
        CommonModule,
        HelperSemiPieChartComponent,
        MatTabsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule

    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    providers: [
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, 
    ],
})

export class DashboardComponent {
    
    fileUrl = env.FILE_BASE_URL;
    public label =  [];
    public dataChart = [];
    branches_income: any[]=[];
    primary_branches_income: any[]=[];
    branches_income_total: any;

    // for pie chart
    public value = '';
    public semi_chart = [
     
    ]
    public firstFormGroup: FormGroup;
    public user: FormattedUser;
    public students: Student[] = [];
    public data: DataResponse;
    public invoices: Invoice[] = [];
    selected = model<Date | null>(null);

    monthDisplay = {
        month: 'ខែនេះ',
        primary_income_month: 'ខែនេះ',
        income_month: 'ខែនេះ'
    };
    khmerMonths = [
        "មករា", "កម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
        "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
    ];

    constructor(
        private _dashbordService: DashbordService,
        private _router: Router,
        private _snackbarService: SnackbarService,
        private _formBuilder: FormBuilder,
    ) {
        this.firstFormGroup = this._formBuilder.group({
            month: [''],
            primary_income_month: ['' ],
            income_month: [''],
           
        });
        this.addBranchesIncomeToChart(); 
    }

    ngOnInit(): void {
        this.view();
        
    }  
    
    view(): void {
        const param: { month?: string , income_month?: string ,primary_income_month?: string } = {};

        if (this.firstFormGroup.get('month').value != '') {
            param.month = this.firstFormGroup.get('month').value;
        }

        
        if (this.firstFormGroup.get('primary_income_month').value != '') {
            param.primary_income_month = this.firstFormGroup.get('primary_income_month').value;
        }

        if (this.firstFormGroup.get('income_month').value != '') {
            param.income_month = this.firstFormGroup.get('income_month').value;
        }

        this._dashbordService.view(param).subscribe({
        next: res => {
            this.data = res;
            this.user = this.data.formattedUser;
            this.students = this.data?.data?.students;
            this.invoices = this.data?.data?.invoices;

            this.branches_income = this.data.data.statistic.invoice.branches_income;
            this.branches_income_total = this.data.data.statistic.invoice.primary_total_income;
            this.primary_branches_income = this.data.data.statistic.invoice.primary_branches_income;

            this.addBranchesIncomeToChart();
            this.PrimaryBranch();


            this.value = new Intl.NumberFormat('en-US').format(this.branches_income_total) + ' $';


        },
        error: err => {
            this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        }
        
        });
    }

    PrimaryBranch(): void{
        this.semi_chart = this.primary_branches_income.map(item => ({
            value: item.total_income, 
            name: item.branch_name    
        }));
    }

    addBranchesIncomeToChart() {
        // Extract the total_income from each branch and push it to dataChart
        const branchIncomes = this.branches_income.map(branch => branch.total_income);
        const branchLabel = this.branches_income.map(branch => branch.branch_name);
        
        const constChart =  [ ...branchIncomes];
        const constlabel = [...branchLabel];
        // Add the extracted incomes to the existing dataChart
        // this.dataChart = [...this.dataChart, ...branchIncomes];
        // this.label = [...this.label, ...branchLabel]
        
        this.dataChart = constChart;
        this.label = constlabel;

        console.log('Updated dataChart:', this.dataChart);
      }

    create(): void {
        this._router.navigateByUrl(`/receptionist/students/create`)
    }

    getStatusClass(status: string): string {
        switch (status) {
          case 'រង់ចាំ':
            return 'text-yellow-500';
          case 'បានទូទាត់':
            return 'text-green-500';
          default:
            return 'text-gray-500';
        }
      }


    monthSelected(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
        const month = normalizedMonth.getMonth();
        const year = normalizedMonth.getFullYear();
        const date = new Date(year, month);
        console.log(`Selected month: ${month + 1}/${year}`);
        datepicker.close(); // Close the datepicker after selection
    }
  
    // Optional: Handle date change if needed
    onMonthSelected(event: any) {
        console.log(event);
    }


    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, name: string) {
        const ctrlValue = this.firstFormGroup.get(name).value ? moment(this.firstFormGroup.get(name).value) : moment(); 
        // ctrlValue.year(normalizedMonthAndYear.year());
        ctrlValue.month(normalizedMonthAndYear.month());
        
        // this.firstFormGroup.get(name).setValue(ctrlValue.format('YYYY-MM'));
        console.log(ctrlValue)
        // Close the datepicker after selecting month and year
        datepicker.close();
    }


    

    setMonth(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, name: string) {
        const ctrlValue = this.firstFormGroup.get(name).value 
          ? moment(this.firstFormGroup.get(name).value) 
          : moment();
    
        
        ctrlValue.month(normalizedMonth.month());
    

        
        // if (ctrlValue.isSame(moment(), 'month')) {
        //     this.monthcheck = "This Month";
        // } else {
        //     this.monthcheck = ctrlValue.format('MMMM'); // Get the full month name
        // }

        if (ctrlValue.isSame(moment(), 'month')) {
            this.monthDisplay[name] = "ខែនេះ"; // "This Month" in Khmer
        } else {
            this.monthDisplay[name] = this.khmerMonths[ctrlValue.month()];
        }
      

        this.firstFormGroup.get(name).setValue(ctrlValue.format('YYYY-MM-DD'));
        // console.log(this.firstFormGroup.get('income_month').value)
        console.log(this.firstFormGroup.get('month').value)
            

        console.log(`${name} Display Month:`, this.monthDisplay[name]); // Log the display month
        this.view();
        datepicker.close();
    }
}
