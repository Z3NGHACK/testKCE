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

@Component({
    selector: 'view-year-report-principal',
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
      
    ],
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss',
    animations: helperAnimations,
})
export class PrincipalReportComponent {
    //for barchart
    public label =  ['មករា', 'កុម្ភៈ', 'មិនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    public data = [300, 450, 320, 1500, 540, 780, 690, 720, 530, 860, 690, 500];

    //for semibar chart
    public value = '302 សិស្ស';
    public semi_chart = [
        { value: 302, name: 'ប្រុស' },
        { value: 128, name: 'ស្រី' },
    ]


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
