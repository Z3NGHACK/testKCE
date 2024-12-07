import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { ClassroomDetailComponent } from '../../../dialog/student-classroom-detail/student-classroom-detail.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { env } from 'envs/env';

@Component({
    selector: 'shared-view-student-classroom',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatIconModule,
        MatCheckbox,
        MatTableModule,
        MatMenuModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        FormsModule,

    ],
    templateUrl: './classroom.component.html',
    styleUrl: './classroom.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentClassroomComponent {
    selectedValue: string | null = '';
    language_id: any[] = [1, 2, 3];
    @Input() data: any;
    @Input() name: any;
    fileUrl: string = env.FILE_BASE_URL;
    @Input() id: number;
    levels: any[] = [];
    backupData: any[] = [];

    constructor(
        private _matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {

        this.levels = this.getFormatData();
        console.log(this.data)

    }

    toggleSingleSelectionIndicator(level_id: number, event: any) {
        // Find the corresponding level from the backupData
        // this.levels=[]
        const backupData: any = this.getFormatData();
        const find = backupData.find(b => b.level_id === level_id);

        if (find) {
            if (event.value.length > 0) {
                // Create a deep copy of the items to avoid mutating the original data
                const filteredItems = JSON.parse(JSON.stringify(find.items))
                    .filter(item => event.value.includes(item.language_id.toString()));

                // Find the corresponding level in `this.levels`
                const levelIndex = this.levels.findIndex(l => l.level_id === level_id);
                if (levelIndex !== -1) {
                    // Update only the items for the specific level in `this.levels`
                    this.levels[levelIndex].items = filteredItems;
                }
            } else {
                this.levels = backupData;
            }

        }

    }

    getFormatData() {
        return Object.values(
            this.data.reduce((acc, current) => {
                const key = `${current.level_id}-${current.level_name}`;

                // Initialize the object in `acc` if it doesn't exist
                if (!acc[key]) {
                    acc[key] = {
                        level_id: current.level_id,
                        level_name: current.level_name,
                        items: []
                    };

                    // If this level_id is not already in language_id array, add it
                    if (!this.language_id.find(l => l.level_id === current.level_id)) {
                        this.language_id.push({
                            level_id: current.level_id,
                            languages_id: []
                        });
                    }
                }

                // Find the corresponding `level_id` object in language_id array
                const languageEntry = this.language_id.find(l => l.level_id === current.level_id);

                // If the current `language_id` doesn't already exist in the `languages_id` array, push it
                if (languageEntry && !languageEntry.languages_id.includes(current.language_id)) {
                    languageEntry.languages_id.push(current.language_id);
                }

                // Add the current item to the corresponding `items` array
                acc[key].items.push(current);

                return acc;
            }, {})
        );
    }



    selectedValues: string[] = [];

    onToggleChange(event: MatButtonToggleChange) {
        const value = event.value;

        if (this.selectedValues.includes(value)) {
            // Remove value from selection (checkbox toggle off)
            this.selectedValues = this.selectedValues.filter(v => v !== value);
        } else {
            // Add value to selection (checkbox toggle on)
            this.selectedValues.push(value);
        }

    }

    viewDetail(item: any): void {
        item.name = this.name;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { path: 'receptionist', data: item, id: this.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(ClassroomDetailComponent, dialogConfig);

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }

}
