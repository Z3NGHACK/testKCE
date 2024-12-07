import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { HelperBarChartComponent } from 'helper/components/bar-chart/bar-chart.component';
import { HelperSemiPieChartComponent } from 'helper/components/semi-piechart/semi-piechart.component';
import { DashbordService } from './dashboard.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { DataResponse, FormattedUser } from './dashboard.type';
import { env } from 'envs/env';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import _moment, { Moment, months } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'app/resources/general-manager/year/view/general/update/update.component';

const moment = _moment;

@Component({
    selector: 'accountant-dashboard',
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

    public label =  [];
    public datas = [];

    public data: DataResponse;
    public user: FormattedUser;
    fileUrl = env.FILE_BASE_URL;
   
    public semi_chart: { value: number; name: string }[] = [];
    public value: string = '';
    public firstFormGroup: FormGroup;
    monthDisplay = {
        month: '',
        primary_income_month: '',
        income_month: ''
    };
    constructor( 
        private _router: Router,
        private _dashboardService: DashbordService,
        private _snackbarService: SnackbarService,
        private _formBuilder: FormBuilder,
                
    ) {
        this.firstFormGroup = this._formBuilder.group({
            month: [''],
            primary_income_month: ['' ],
            income_month: [''],
           
        });
    }
    
    ngOnInit(): void {

        const currentYear = moment().format('YYYY');  

        this.monthDisplay.month = currentYear;
        this.monthDisplay.primary_income_month = currentYear;
        this.monthDisplay.income_month = currentYear;

        this.listing()
    }

    view(): void {
        this._router.navigateByUrl(`/accountant/payment`)
    }

    listing(): void {
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

        this._dashboardService.view(param).subscribe({
        next: res => {
            this.data = res;
            this.user = this.data.formattedUser;

            this.label = [];
            this.datas = [];

            const invoiceByMonth = this.data.data.invoice_by_month;
            for (const [month, income] of Object.entries(invoiceByMonth)) {
                this.label.push(month);     
                this.datas.push(income);    
            }

            const primaryGradeIncome = this.data.data.invoice?.primary_grade_income;
            const chart_data: { value: number; name: string }[] = [];
            
            if (Array.isArray(primaryGradeIncome)) {
                for (const grade of primaryGradeIncome) {
                    chart_data.push({ value: grade.total_income, name: grade.grade_name });
                }
            }  
            this.semi_chart = chart_data;

            const primaryTotalIncome = this.data.data.invoice?.primary_total_income;
            this.value = primaryTotalIncome.toLocaleString('en-US') + '$';

        },
        error: err => {
            this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        }
    
        });
    }

    

    setYear(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, name: string) {
        // Get the current value or default to the current moment
        const ctrlValue = this.firstFormGroup.get(name).value
            ? moment(this.firstFormGroup.get(name).value)
            : moment();
    
        ctrlValue.year(normalizedMonth.year());
    
       
        this.firstFormGroup.get(name).setValue(ctrlValue.format('YYYY'));
    
       
        this.monthDisplay[name] = ctrlValue.year()
        // console.log(this.monthDisplay[name])
        
        this.listing();
    
        // Close the datepicker after selection
        datepicker.close();
    }
    
    

}
