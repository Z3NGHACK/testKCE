// ================================================================>> Core Library
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// ================================================================>> Third-Party Library
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabContent, MatTabsModule } from '@angular/material/tabs';
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
import { TeacherGeneralComponent } from './general/general.component';
import { SharedTeacherService } from '../teacher.service';
import { Classrooms, General } from '../teacher.types';
import { TeacherClassroomComponent } from './classroom/classroom.component';
import { TeacherFileComponent } from './file/file.component';
import { Classroom } from 'app/resources/general-manager/branch/branch.type';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
    selector: 'shared-view-teacher',
    standalone: true,
    imports: [
        MatTabsModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDialogModule,
        CommonModule,
        FormsModule,
        MatExpansionModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        TeacherGeneralComponent,
        TeacherClassroomComponent,
        TeacherFileComponent,
        MatButtonModule,
        MatTabContent,
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
    
})
export class SharedViewTeacherComponent {

// ================================================================>> varable for sevice
  public generalData: General;
  public classroomData: Classrooms[] = [];

  path: 'principal' | 'general-manager';
  public id: number;
  fileUrl: string = env.FILE_BASE_URL

  
 // ================================================================>> full price for other payment
  public otherPaymentFullPrice: number = 0;
  fullPriceDollar: number = 0;
  fullPriceKHR: number = 0;
  public exchange_rate: any[];
  loading = true;

  selectedTabIndex: number = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _matDialog: MatDialog,
    private _snackbarService: SnackbarService,
    private _formBuilder: FormBuilder,
    private _teacherService: SharedTeacherService
  ) {
    this.path = this._activatedRoute.snapshot.data.from;

  }

  ngOnInit(): void {
      this._activatedRoute.paramMap.subscribe(params => {
          this.id = +params.get('id'); 
      });
      this.view();
        
    const savedTabIndex = localStorage.getItem('PrincipalTeacherTabIndex');
    this.selectedTabIndex = savedTabIndex !== null ? +savedTabIndex : 0;
    
    
  }


  onTabChange(index: number): void {
    console.log('Tab Index:', index); // Debugging log
    if (index !== undefined && index !== null) {
      localStorage.setItem('PrincipalTeacherTabIndex', index.toString());
    } else {
      console.error('Invalid index received:', index);
    }
  }

    // ================================================================>> go back to listing 
    back(): void {
        this.path === 'principal'
        ? this._router.navigateByUrl(`${this.path}/teacher`)
        : this._router.navigateByUrl(`/teacher`);
    }

    view(): void {
        this.loading = true;
        this._teacherService.view(this.path, this.id).subscribe({
          next: res => {
            this.generalData = res.general;
            this.classroomData = res.classrooms;
            this.loading = false; 
          },
          error: err => {
            this._snackbarService.openSnackBar(
              err?.error?.message || GlobalConstants.genericError,
              GlobalConstants.error
            );
            this.loading = false;
          }
        });
      }
    

    onNameUpdate(updatedName: string): void {
        this.generalData.name = updatedName;
    }

}
