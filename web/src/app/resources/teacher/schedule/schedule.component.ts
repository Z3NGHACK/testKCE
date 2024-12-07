import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TeacherService } from '../teacher.service';
import { ClassroomService } from 'app/resources/principal/class/class.service';

@Component({
    selector: 'teacher-schedule',
    standalone: true,
    imports: [MatIconModule, CommonModule],
    providers: [DatePipe],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
    currentDate = new Date();
    daysInMonth: number[] = [];
    semester: any;
    data = [];
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
    constructor(private service: TeacherService) {}
    ngOnInit() {
        this.service.getCalenderSetup().subscribe((res: any) => {
            this.timeSlots = res.data.timeSlots;
            this.weekDays = res.data.weekDays;
        });
        this.generateDaysInMonth(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1
        );
    }

    generateDaysInMonth(year: number, month: number) {
        this.service.getCalender({ year, month }).subscribe((res: any) => {
            this.data = res.data;
            this.semester = res.semester;
        });
    }

    prevMonth() {
        this.currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() - 1,
            1
        );
        // Generate days for the updated currentDate
        this.generateDaysInMonth(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1
        );
    }

    nextMonth() {
        this.currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            1
        );
        // Generate days for the updated currentDate
        this.generateDaysInMonth(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1
        );
    }
}
