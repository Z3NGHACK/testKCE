import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TeacherService } from '../../teacher.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'teacher-class-room',
    standalone: true,
    templateUrl: './class-room.component.html',
    styleUrl: './class-room.component.scss',
    animations: [
        trigger('fadeInCustom', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms', style({ opacity: 1 }))
            ])
        ])
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonToggleModule,
        MatMenuModule,

    ],
})
export class ClassRoomComponent {
    key: string = '';
    academic_id: number = 1;
    academics: academics[] = [];
    languages: any[] = [];
    language_id: any[] = [1, 2, 3];
    levels: any[] = [];
    data = [];
    backUpdata: any[] = [];
    constructor(
        private _router: Router,
        private _service: TeacherService
    ) {

    }
    async ngOnInit(): Promise<void> {
        await this.setup();
        await this.listing();
    }
    async setup(): Promise<void> {
        await this._service.setup().subscribe(
            (res: { data: { academics: academics[], languages: any[], levels: any[] } }) => {
                this.academics = res.data.academics;
                this.languages = res.data.languages;
                this.levels = res.data.levels;
            }
        )
    }
    async listing(): Promise<void> {
        const option = { academic_id: this.academic_id }
        await this._service.listing(option).subscribe(
            (res: any) => {
                this.backUpdata = res.data;
                this.data = this.getFormatData();
            }
        )
    }
    checkSelectLanguage = [];


    chnageLanguage(level_id: number, event: any) {

        const backupData: any = this.getFormatData();
        const find = backupData.find(b => b.level_id === level_id);

        if (find) {
            if (event.value.length > 0) {
                // Create a deep copy of the items to avoid mutating the original data
                const filteredItems = JSON.parse(JSON.stringify(find.classrooms))
                    .filter(item => event.value.includes(item.language_id));
                console.log(filteredItems)

                // Find the corresponding level in `this.levels`
                const levelIndex = this.data.findIndex(l => l.level_id === level_id);
                if (levelIndex !== -1) {
                    // Update only the items for the specific level in `this.levels`
                    this.data[levelIndex].classrooms = filteredItems;
                }
            } else {
                this.data = backupData;
            }

        }

    }
    getFormatData() {
        return Object.values(
            this.backUpdata.reduce((acc, current) => {
                const key = `${current.level_id}-${current.level_name}`;

                // Initialize the object in `acc` if it doesn't exist
                if (!acc[key]) {
                    acc[key] = {
                        level_id: current.level_id,
                        level_name: current.level_name,
                        classrooms: []
                    };

                }
                // Add the current item to the corresponding `items` array
                acc[key].classrooms.push(current);

                return acc;
            }, {})
        );
    }

    filterClassrooms(index: number, event: any) {
        // Create a deep copy of the level data to avoid modifying the backup data
        let levelCopy = JSON.parse(JSON.stringify(this.backUpdata[index]));

        if (levelCopy) {
            // Check if any languages are selected
            if (event.value.length > 0) {
                // Filter classrooms based on selected language IDs
                levelCopy.classrooms = levelCopy.classrooms.filter(classroom => event.value.includes(classroom.language_id));
            }
            // Apply the filtered classrooms to the current data without modifying backUpdata
            this.data[index].classrooms = levelCopy.classrooms;
        }

        console.log('Filtered Data:', this.data);
        console.log('Backup Data (Unchanged):', this.backUpdata);
    }

    view(id: number): void {
        this._router.navigateByUrl(`teacher/class-room/view/${id}`);
    }
}
export interface academics {
    id: number,
    title: string
}
