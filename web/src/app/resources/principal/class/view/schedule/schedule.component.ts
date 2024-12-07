import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ClassroomService } from '../../class.service';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogModule,
} from '@angular/material/dialog';
import { PrincipleScheduleDetailComponent } from './detail/detail.component';
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

@Component({
    selector: 'principle-classroom-schedule',
    standalone: true,
    imports: [
        MatIconModule,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        FormsModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatCalendar,
        MatButtonModule,
        NgClass,
        MatButtonToggleModule,
    ],
    providers: [DatePipe],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.scss',
})
export class PrincipleClassRoomScheduleComponent {
    @Input() id: number;
    @Input() data: any;
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
        private service: ClassroomService,
        private teacherService: TeacherService,
        private _matDialog: MatDialog,
        private _snackBarService: SnackbarService
    ) {}
    ngOnInit(): void {
        this.generateCalendar();
        this.getSetup();
    }

    subjects: any = [];
    getSetup() {
        this.service.Schedulesetup().subscribe((res: any) => {
            this.timeSlots = res.data.timeSlots;
            this.weekDays = res.data.weekDays;
        });
        this.teacherService.getSetup(this.id).subscribe((res: any) => {
            this.subjects = res.data;
        });
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

    update(time, day) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            id: this.id,
            semester: this.semester,
            time,
            day,
            subjects: this.subjects,
        };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            PrincipleScheduleDetailComponent,
            dialogConfig
        );
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                this.data = res;
            }
        });
    }
    delete(id) {
        this.service.deleteCalender(id).subscribe({
            next: (res) => {
                this.data = res.data;
                this._snackBarService.openSnackBar(
                    res.message,
                    GlobalConstants.success
                );
            },
            error: (err) => {
                let message: string =
                    err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(
                    message,
                    GlobalConstants.error
                );
            },
        });
    }

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
