// ================================================================>> Core Library
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// ================================================================>> Third-Party Library
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabContent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { GlobalConstants } from 'helper/shared/constants';
import { FormBuilder,  FormsModule, ReactiveFormsModule} from '@angular/forms';
// ================================================================>> Custom Library Librarys

import { MatIconModule } from '@angular/material/icon';
import { helperAnimations } from 'helper/animations';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { TeacherComponent } from 'app/resources/general-manager/teacher/listing/teacher.component';
import { MatCommonModule } from '@angular/material/core';
import { PrinicpalGeneralComponent } from './general/general.component';
import { ApplicationPrincipleComponent } from './application/application.component';
import { PrincipalReportComponent } from './report/report.component';
import { AcademicService } from '../academic.service';
import { General } from '../academic.type';
import { SharedViewYearComponent } from 'app/shared/year/view/view.component';

@Component({
    selector: 'view-classroom-principal',
    standalone: true,
    imports: [
        MatIconModule,
        MatCommonModule,
        MatTabsModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatTabContent,
        PrinicpalGeneralComponent,
        ApplicationPrincipleComponent,
        PrincipalReportComponent,
        SharedViewYearComponent
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
    animations: helperAnimations,
})
export class ViewYearComponent {

  // ================================================================>> varable for sevice
  public id: number;
  fileUrl: string = env.FILE_BASE_URL
  // ================================================================>> full price for other payment
  public otherPaymentFullPrice: number = 0;
  fullPriceDollar: number = 0;
  fullPriceKHR: number = 0;
  public exchange_rate: any[];
  public data: General

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _academicService: AcademicService,
    private _snackbarService: SnackbarService,
  ) {

  }
    ngOnInit(): void {
      this._activatedRoute.paramMap.subscribe(params => {
        this.id = +params.get('id'); 
      });
      this.view();
    }

    back(): void {
      this._router.navigateByUrl(`/principal/year`);
   }
   
   view(): void {
    this._academicService.view(this.id).subscribe({
    next: res => {
        this.data = res.general; 
    },
    error: err => {
        this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
    }
    
    });
}

}
