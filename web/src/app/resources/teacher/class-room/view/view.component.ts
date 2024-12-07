// ================================================================>> Core Library
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// ================================================================>> Third-Party Library
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';

// ================================================================>> Custom Library Librarys

import { MatIconModule } from '@angular/material/icon';
import { helperAnimations } from 'helper/animations';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';

import { MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { ClassRoomGeneralComponent } from './general/general.component';
import { ClassRoomStudentComponent } from './student/student.component';
import { ClassRoomTeachingComponent } from './teaching/teaching.component';
import { TeacherService } from '../../teacher.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { ClassRoomReportComponent } from './report/report.component';
import { TeacherClassRoomScheduleComponent } from './schedule/schedule.component';


@Component({
    selector: 'teacher-class-room-view',
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
        MatTableModule,
        MatExpansionModule,
        MatRadioModule,
        MatMenuModule,
        MatInputModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        ClassRoomGeneralComponent,
        ClassRoomStudentComponent,
        ClassRoomTeachingComponent,
        ClassRoomReportComponent,
        TeacherClassRoomScheduleComponent,
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
})
export class ClassRoomViewComponent {
    path: any;
    id: number;
    data: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _matDialog: MatDialog,
        private _snackbarService: SnackbarService,
        private _service: TeacherService
    ) {
        this.path = this._activatedRoute.snapshot.data.from;

    }

    ngOnInit(): void {
        this._activatedRoute.paramMap.subscribe(params => {
            this.id = +params.get('id');
        });
        this.view();

    }
    view() {
        this._service.view(this.id).subscribe((res: any) => {
            this.data = res;
        })
    }

    back(): void {
        this._router.navigateByUrl(`teacher/class-room`)
    }
}
