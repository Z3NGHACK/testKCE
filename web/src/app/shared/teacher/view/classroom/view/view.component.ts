// ================================================================>> Core Library
import { Component, Inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// ================================================================>> Third-Party Library
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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


import { General } from 'app/resources/principal/class/classroom.type';
import { ClassroomService } from 'app/resources/principal/class/class.service';
import { Classrooms } from 'app/shared/teacher/teacher.types';
import { SharedClassRoomGeneralComponent } from './general/general.component';
import { SharedClassRoomStudentComponent } from './student/student.component';
import { SharedClassRoomTeachingComponent } from './teaching/teaching.component';
import { SharedClassRoomReportComponent } from './report/report.component';
import { SharedClassRoomScheduleComponent } from './schedule/schedule.component';

@Component({
    selector: 'Shared-view-classroom',
    standalone: true,
    imports: [
      MatIconModule,
      MatCommonModule,
      MatTabsModule,
      MatDialogModule,
      MatButtonModule,
      SharedClassRoomGeneralComponent,
      SharedClassRoomStudentComponent,
      SharedClassRoomTeachingComponent,
      SharedClassRoomReportComponent,
      SharedClassRoomScheduleComponent
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
})
export class SharedViewClassroomComponent {

  // ================================================================>> varable for sevice
  path: 'principal' | 'general-manager';
  fileUrl: string = env.FILE_BASE_URL
 // ================================================================>> full price for other payment
  public otherPaymentFullPrice: number = 0;
  fullPriceDollar: number = 0;
  fullPriceKHR: number = 0;
  public exchange_rate: any[];
  public data: Classrooms;

  constructor(
    public dialogRef: MatDialogRef<SharedViewClassroomComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: {data: Classrooms , path: 'principal' | 'general-manager'} ,
    
    private _activatedRoute: ActivatedRoute,
  ) {
    this.path = this._activatedRoute.snapshot.data.from;
  }
  
    ngOnInit(): void {
        this.data = this.datas.data;
        this.path = this.datas.path;
        this.view();
        console.log(this.data)
    }

    // ================================================================>> go back to listing 
    back(): void {
      this.dialogRef.close()
    }

    view(): void {
      // this._classroomService.view(this.id).subscribe({
      // next: res => {
      //     this.data = res.general; 
      // },
      // error: err => {
      //     this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
      // }
      
      // });
  }

  

}
