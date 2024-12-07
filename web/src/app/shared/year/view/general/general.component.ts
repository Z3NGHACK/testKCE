// ================================================================>> Core Library
import { ChangeDetectorRef, Component, EventEmitter, input, Input, OnInit, Output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// ================================================================>> Third-Party Library
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { GlobalConstants } from 'helper/shared/constants';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';

// ================================================================>> Custom Library Librarys

import { MatIconModule } from '@angular/material/icon';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { HelperSemiPieChartComponent } from 'helper/components/semi-piechart/semi-piechart.component';
import { General, Semester, TotalPriceByBranch } from 'app/resources/principal/year/academic.type';
import { SharedAcademicService } from '../../year.service';
import { SharedYearUpdateComponent } from './update/update.component';
// import { GMYearUpdateComponent } from './update/update.component';


@Component({
    selector: 'shared-view-year-general',
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
        HelperSemiPieChartComponent

    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss'
})
export class SharedGeneralComponent {

    @Input() id: number;
    @Input() path: 'principal' | 'general-manager';
    @Output() dialogClosed = new EventEmitter<void>();
    public value = '';
    public semi_chart: any[] = [];

    public data: General;
    fileUrl: string = env.FILE_BASE_URL;
    public semesters: Semester[] = [];
    public male_student: any;
    dataSource: MatTableDataSource<TotalPriceByBranch> = new MatTableDataSource<TotalPriceByBranch>([]);
    displayedColumns: string[] = ['profile', 'total', 'income', 'receive', 'action'];


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _matDialog: MatDialog,
        private _snackbarService: SnackbarService,
        private _academicService: SharedAcademicService,
        private _formBuilder: FormBuilder,
        private cd: ChangeDetectorRef
    ) {

    }

    ngOnInit(): void {
        this.view();
        console.log(this.male_student);
        // this.semi_chart = [
        //     { value: 12 , name: 'បុរស ' },
        //     { value: 13, name: 'ស្ត្រី ' },
        // ];
        console.log(this.path)
    }



    update(row: General): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { row, id: this.id, path: this.path };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const updateDialogRef = this._matDialog.open(SharedYearUpdateComponent, dialogConfig);
        updateDialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Call your function here after dialog is closed
                this.view();
            }
        });
    }

    formatKhmerDateRange(fromDate: string): string {
        const khmerMonths = [
            'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
            'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
        ];

        const from = new Date(fromDate);

        // Correcting the month index by adding 1
        const Month = khmerMonths[from.getUTCMonth()];
        const Year = from.getUTCFullYear();

        return `${Month} ${Year}`;
    }



    view(): void {
        this._academicService.view(this.path, this.id).subscribe({
            next: res => {
                this.data = res.general;
                this.semesters = this.data.semesters;
                this.semesters.sort((a, b) => a.title.localeCompare(b.title));
                this.dataSource.data = this.data.total_price_by_branch;
                this.male_student = this.data.n_student - this.data.female_student_count;
                console.log(this.dataSource.data);
                // Ensure this data is set correctly
                this.value = `${this.data?.n_student} សិស្ស`

                this.semi_chart = [
                    { value: this.data?.n_student - this.data?.female_student_count, name: 'ប្រុស ' },
                    { value: this.data?.female_student_count, name: 'ស្រី' }
                ]

                // Log to verify data
                console.log('Updated semi_chart:', this.semi_chart);


            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

}
