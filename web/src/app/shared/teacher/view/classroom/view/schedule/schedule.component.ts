import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
    MatDialog,
    MatDialogConfig,
    MatDialogModule,
} from '@angular/material/dialog';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCalendar } from '@angular/material/datepicker';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';

@Component({
    selector: 'Shared-classroom-schedule',
    standalone: true,
    imports: [
        MatIconModule,
        CommonModule,
        MatDialogModule,
        FormsModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatButtonModule,
        MatButtonToggleModule,
    ],
    providers: [DatePipe],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.scss',
})
export class SharedClassRoomScheduleComponent {
    @Input() id: number;
    @Input() data: any;
    @Input() path: 'principal' | 'general-manager';
    currentDate = new Date();
    daysInMonth: number[] = [];
    semester: any = '1';
    monthNames: string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    weekDays: any[] = [
        {
            id: 1,
            title: 'ច័ន្ទ',
        },
        {
            id: 2,
            title: 'អង្គារ',
        },
        {
            id: 3,
            title: 'ពុធ',
        },
        {
            id: 4,
            title: 'ព្រហស្បតិ៍',
        },
        {
            id: 5,
            title: 'សុក្រ',
        },
        {
            id: 6,
            title: 'សៅរ៏',
        },
        {
            id: 7,
            title: 'អាទិត្យ',
        },
    ];
    // Time slots for each row
    timeSlots: any[] = [
        {
            id: 1,
            title: '7:00 AM - 8:00 AM',
        },
        {
            id: 2,
            title: '8:00 AM - 9:00 AM',
        },
        {
            id: 3,
            title: '9:00 AM - 10:00 AM',
        },
        {
            id: 4,
            title: '2:00 PM - 3:00 PM',
        },
        {
            id: 5,
            title: '3:00 PM - 4:00 PM',
        },
        {
            id: 6,
            title: '4:00 PM - 5:00 PM',
        },
    ];

    constructor(
        private datePipe: DatePipe,
        private service: SharedTeacherService,
        private teacherService: SharedTeacherService,
        private _matDialog: MatDialog,
        private _snackBarService: SnackbarService
    ) {}
    ngOnInit(): void {
        this.view();
        this.generateCalendar();
        this.getSetup();
    }

    view(): void {
        this.teacherService.viewClassroom(this.path , this.id).subscribe({
        next: res => {
            this.data = res.schedules;
        },
        error: err => {
            this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        }
        });
    }

    subjects: any = [];
    getSetup() {
        this.service.Schedulesetup(this.path).subscribe((res: any) => {
            this.timeSlots = res.data.timeSlots;
            this.weekDays = res.data.weekDays;
        });
        // this.teacherService.getSetup(this.path ,this.id).subscribe((res: any) => {
        //     this.subjects = res.data;
        // });
    }
    toggleSingleSelectionIndicator(event: any) {
        this.semester = event?.value;
    }
    generateCalendar() {
        const startOfMonth = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            1
        );
        const endOfMonth = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            0
        );

        const daysBefore = startOfMonth.getDay();
        const daysAfter = 6 - endOfMonth.getDay();

        this.daysInMonth = [];

        // Days before current month
        for (let i = 0; i < daysBefore; i++) {
            this.daysInMonth.push(null);
        }

        // Days of current month
        for (let i = 1; i <= endOfMonth.getDate(); i++) {
            this.daysInMonth.push(i);
        }

        // Days after current month
        for (let i = 0; i < daysAfter; i++) {
            this.daysInMonth.push(null);
        }
    }

    // update(time, day) {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.data = {
    //         id: this.id,
    //         semester: this.semester,
    //         time,
    //         day,
    //         subjects: this.subjects,
    //     };
    //     dialogConfig.position = { right: '0', top: '0' };
    //     dialogConfig.height = '100vh';
    //     dialogConfig.panelClass = 'side-dialog';
    //     dialogConfig.autoFocus = false;

    //     const dialogRef = this._matDialog.open(
    //         PrincipleScheduleDetailComponent,
    //         dialogConfig
    //     );
    //     dialogRef.afterClosed().subscribe((res: any) => {
    //         if (res) {
    //             this.data = res;
    //         }
    //     });
  

    prevMonth() {
        this.currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() - 1,
            1
        );
        this.generateCalendar();
    }

    nextMonth() {
        this.currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            1
        );
        this.generateCalendar();
    }
}
