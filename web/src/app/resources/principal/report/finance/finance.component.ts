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

@Component({
    selector: 'principal-report-finance',
    standalone: true,
    imports: [
        MatIconModule,
        MatCommonModule,
        MatTabsModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabContent,
        HelperBarChartComponent,
        HelperSemiPieChartComponent,
        HelperMultipleBarChartComponent,
        HelperLineChartComponent,
        HelperPieChartComponent,
    ],
    templateUrl: './finance.component.html',
    styleUrl: './finance.component.scss'
})
export class ReportFinanceComponent {
     //for barchart
     public label =  ['មករា', 'កុម្ភៈ', 'មិនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
     public data = [300, 450, 320, 1500, 540, 780, 690, 720, 530, 860, 690, 500];
 
     //for semibar chart
     public value = '302 សិស្ស';
     public semi_chart = [
         { value: 302, name: 'ប្រុស' },
         { value: 128, name: 'ស្រី' },
     ]
    // for multiple bar chart
     barChartData = [
       { name: 'ប្រុស', data: [120, 132, 101, 134, 90] },
       { name: 'ស្រី', data: [220, 182, 191, 234, 290] },
     ];

     xAxisCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
     // for line chart
     categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

     lineChartData = [
       {
         name: 'ចូលរៀន',
         data: [820, 932, 901, 934, 1290, 1330, 1320]
       },
       {
         name: 'អត់ចូលរៀន',
         data: [620, 732, 701, 834, 1190, 1230, 1220]
       }
     ];
     //
     pieChartData = [
       { value: 46, name: 'មានជ័យ' },
       { value: 106, name: 'ផ្សាដេប៉ូ' },
       { value: 75, name: 'ចំកាដូង' },
       { value: 75, name: 'ត្រាំខ្នា' },
     ];
     public valuePie = '302 សិស្ស';

 
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
   ) {
 
   }
   
     ngOnInit(): void {
 
     }
 
}
