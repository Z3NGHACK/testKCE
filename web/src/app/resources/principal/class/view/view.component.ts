// ================================================================>> Core Library
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// ================================================================>> Third-Party Library
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButton, MatButtonModule } from '@angular/material/button';
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
import { PrinicpalGeneralComponent } from '../../year/view/general/general.component';
import { PrincipleClassRoomGeneralComponent } from './general/general.component';
import { PrincipleClassRoomStudentComponent } from './student/student.component';
import { PrincipleTeachingComponent } from './teaching/teaching.component';
import { General } from '../classroom.type';
import { ClassroomService } from '../class.service';
import { PrincipleClassRoomScheduleComponent } from './schedule/schedule.component';
import { PrincipleClassRoomReportComponent } from './report/report.component';

@Component({
  selector: 'view-classroom-principal',
  standalone: true,
  imports: [
      MatIconModule,
      MatCommonModule,
      MatTabsModule,
      MatButtonModule,
      PrincipleClassRoomGeneralComponent,
      PrincipleClassRoomStudentComponent,
      PrincipleTeachingComponent,
      PrincipleClassRoomScheduleComponent,
      PrincipleClassRoomReportComponent,

  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewClassroomPrincipleComponent {

  // ================================================================>> varable for sevice
  path: 'principal' | 'general-manager';
  public id: number;
  fileUrl: string = env.FILE_BASE_URL
 // ================================================================>> full price for other payment
  public otherPaymentFullPrice: number = 0;
  fullPriceDollar: number = 0;
  fullPriceKHR: number = 0;
  public exchange_rate: any[];
  public data: General;
  public schedules:any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _matDialog: MatDialog,
    private _snackbarService: SnackbarService,
    private _formBuilder: FormBuilder,
    private _classroomService: ClassroomService
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
       this._router.navigateByUrl(`/principal/class`);
    }

    view(): void {
      this._classroomService.view(this.id).subscribe({
      next: res => {
          this.data = res.general;
          this.schedules=res.schedules;
      },
      error: err => {
          this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
      }

      });
  }


}
