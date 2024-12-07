import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { DashbordService } from 'app/resources/principal/dashboard/dashbord.service';
import { DataResponse } from 'app/resources/principal/dashboard/dashbord.type';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { HelperBarChartComponent } from 'helper/components/bar-chart/bar-chart.component';
import { BranchService } from '../../branch.service';
import { BranchDetail, GeneralData, Invoice, MainData, Student } from '../../branch.type';
import { MatMenuModule } from '@angular/material/menu';
import { helperAnimations } from 'helper/animations';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BranchViewPaymentComponent } from '../view-payment/view.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewDialogDetailComponent } from '../dialog-detail/dialog-detail.component';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import _moment, { Moment, months } from 'moment';
import { HelperSemiPieChartComponent } from 'helper/components/semi-piechart/semi-piechart.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from 'app/shared/year/view/general/update/update.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { UpdateBranchComponent } from './update/update.component';

const moment = _moment;

@Component({
    selector: 'general-manager-branch-general',
    standalone: true,
    imports: [
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatButtonModule,
        CommonModule,
        MatTooltipModule,
        HelperBarChartComponent,
        PortraitComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        FormsModule,
        HelperSemiPieChartComponent,
        MatTabsModule
    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss',
    animations: helperAnimations,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, 
    ],
    
})

export class BranchGeneralComponent {
    @Input() id: number

    fileUrl = env.FILE_BASE_URL;
    public label =  [];
    public dataChart = [];

    public branchDetail: BranchDetail;
    public students: Student[] = [];
    public data: GeneralData;
    public invoices: Invoice[] = [];
    public firstFormGroup: FormGroup;

    public value = '';
    public semi_chart = [];

    branches_income: any[]=[];
    primary_branches_income: any[]=[];
    branches_income_total: any;
  
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
        private _cd: ChangeDetectorRef,
        private _branchService: BranchService,
        private _router: Router,
        private _snackbarService: SnackbarService,
        private _matDialog: MatDialog,
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

    ngAfterContentChecked(){
        this._cd.detectChanges()
    }

    create(): void {
        this._router.navigateByUrl(`/receptionist/students/create`)
    }

    getStatusClass(status: string): string {
        switch (status) {
          case 'រៀបចំ':
            return 'text-yellow-500';
          case 'កំពុងដំណើការ':
            return 'text-green-500';
          case 'ផ្អាក':
            return 'text-red-500';
          default:
            return 'text-gray-500';
        }
      }

    getStatusInvoice(status: string): string {
        switch (status) {
          case 'រង់ចាំ':
            return 'text-yellow-500';
          case 'បានទូទាត់':
            return 'text-green-500';
          default:
            return 'text-gray-500';
        }
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
        
        this._branchService.view(this.id , param).subscribe({
            next: res => {
                this.data = res.general;
                this.branchDetail= res.branchDetails;
                this.students = this.data.students;
                this.invoices = this.data.invoices;

                this.branches_income = this.data.statistic.invoice.branches_income;
                this.branches_income_total = this.data.statistic.invoice.primary_total_income;
                this.primary_branches_income = this.data.statistic.invoice.primary_branches_income;

                this.addBranchesIncomeToChart();
                this.PrimaryBranch();
                this.value = new Intl.NumberFormat('en-US').format(this.branches_income_total) + ' $'
            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    viewInvoice(row: Invoice): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = row.id 
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        this._matDialog.open(BranchViewPaymentComponent, dialogConfig);
        this._cd.detectChanges()  
    }


    

    viewStudent(item: any): void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {data: item , id: item.id , path: 'student' }
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        this._matDialog.open(ViewDialogDetailComponent, dialogConfig);
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

    addBranchesIncomeToChart() {
        const branchIncomes = this.branches_income.map(branch => branch.total_income);
        const branchLabel = this.branches_income.map(branch => branch.branch_name);
        
        const constChart =  [ ...branchIncomes];
        const constlabel = [...branchLabel];    
        this.dataChart = constChart;
        this.label = constlabel;

        console.log('Updated dataChart:', this.dataChart);
    }

    PrimaryBranch(): void{
        this.semi_chart = this.primary_branches_income.map(item => ({
            value: item.total_income, 
            name: item.branch_name    
        }));
    }

    update(){
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.data = this.branchDetail;
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(UpdateBranchComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(() => {
            this.view();
        });

    }
}   
