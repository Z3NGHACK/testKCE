import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCommonModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { helperAnimations } from 'helper/animations';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CapitalizePipe } from 'helper/pipes/capitalize.pipe';
import { StaffService } from '../staff.service';

import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { General } from '../staff.type';
import { ViewEmployeeGeneralComponent } from './general/general.component';
import { ViewEmployeeFileComponent } from './file/file.component';
@Component({
    selector: 'principal-view-staff',
    standalone: true,
    imports: [
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatButtonModule,
        CommonModule,
        MatTabsModule,
        ViewEmployeeGeneralComponent,
        ViewEmployeeFileComponent,
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
})
export class ViewStaffComponent {
    // ================================================================>> varable for sevice

  public generalData: General;
  path: 'principal' | 'general-manager';
  public id: number;
  fileUrl: string = env.FILE_BASE_URL
 // ================================================================>> full price for other payment
  public otherPaymentFullPrice: number = 0;
  fullPriceDollar: number = 0;
  fullPriceKHR: number = 0;
  public exchange_rate: any[];


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _matDialog: MatDialog,
    private _snackbarService: SnackbarService,
    private _formBuilder: FormBuilder,
    private _teacherService: StaffService
  ) {
    this.path = this._activatedRoute.snapshot.data.from;

  }
  
  ngOnInit(): void {
      this._activatedRoute.paramMap.subscribe(params => {
          this.id = +params.get('id'); 
      });
      this.view();
  }

  // ================================================================>> go back to listing 
  back(): void {
    this._router.navigateByUrl(`/principal/staff`);
  }

  view(): void {
      this._teacherService.view(this.id).subscribe({
      next: res => {
          this.generalData = res.general; 
      },
      error: err => {
          this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
      }
      
      });
  }

  onNameUpdate(updatedName: string): void {
    this.generalData.name = updatedName;
  }

}