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

import { General } from 'app/resources/principal/year/academic.type';
import { SharedAcademicService} from '../year.service';
import { SharedGeneralComponent } from './general/general.component';
import { SharedApplicationComponent } from './application/application.component';


@Component({
    selector: 'shared-view-year',
    standalone: true,
    imports: [
    MatIconModule,
    MatCommonModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatTabContent,
    SharedGeneralComponent,
    SharedApplicationComponent
 
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss'
})
export class SharedViewYearComponent {
    
  // ================================================================>> varable for sevice
  public id: number;
  fileUrl: string = env.FILE_BASE_URL
  path: 'principal' | 'general-manager';

  // ================================================================>> full price for other payment
  public otherPaymentFullPrice: number = 0;
  fullPriceDollar: number = 0;
  fullPriceKHR: number = 0;
  public exchange_rate: any[];
  public data: General

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _academicService: SharedAcademicService,
    private _snackbarService: SnackbarService,
  ) {
    this.path = this._activatedRoute.snapshot.data.from;
  }
    ngOnInit(): void {
      this._activatedRoute.paramMap.subscribe(params => {
        this.id = +params.get('id'); 
      });
      this.view();
    }

    back(): void {
        this.path === 'principal'
        ? this._router.navigateByUrl(`${this.path}/year`)
        : this._router.navigateByUrl(`/year`);
    }
   
   view(): void {
        this._academicService.view(this.path , this.id).subscribe({
        next: res => {
            this.data = res.general; 
        },
        error: err => {
            this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        }
    
    });
}
}
