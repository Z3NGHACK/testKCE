import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabContent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedViewTeacherComponent } from 'app/shared/teacher/view/view.component';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { ProgramService } from '../../program.service';
import { General, GradeScore, Language } from '../../program.interface';
import { CommonModule } from '@angular/common';
import { CreateSubjectComponent } from './create/create-subject.component';
import { UpdateProgramComponent } from '../../update/update.component';
import { result } from 'lodash';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { CreateScoreCategoryComponent } from 'app/resources/general-manager/setting/subject/create-score-category/create-score-category.component';
import { AddScoreCategoryComponent } from './create-score-category/create-score-category.component';
import { UpdateScoreCategoryComponent } from './update-score-category/update-score-category.component';
import { UpdatePaymentComponent } from './update-payment/update-payment.component';
import { distinctUntilChanged, tap } from 'rxjs';
import { HelperConfirmationDialogComponent } from 'helper/services/confirmation/dialog/dialog.component';
import { HelperConfirmationConfig, HelperConfirmationService } from 'helper/services/confirmation';

@Component({
    selector: 'general-manager-view-program-general',
    standalone: true,
    imports: [
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        MatMenuModule,
        MatMenu,
        MatButtonModule
    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss'
})
export class ProgramGeneralComponent {
    @Input() id: number;
    @Output() updateData: EventEmitter<Language[]> = new EventEmitter();  // Define EventEmitter
    public data: General;
    public total_subjects: number;
    public data_lanugages: Language[];
    public grade_score: GradeScore[];

    public total_language: number;
    public total_gradescore: number;

    constructor(
        private _snackbarService: SnackbarService,
        private confirmService: HelperConfirmationService,
        private _service: ProgramService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this._activatedRoute.paramMap.subscribe(params => {
            this.id = +params.get('id');
        });
        this._service.getProgram().pipe(distinctUntilChanged()).subscribe((res: any) => {
            this.data = res?.general;
            this.data_lanugages = this.data?.languages;
            this.total_subjects = this.data?.total_subjects;
            this.grade_score = this.data?.grade_scores;
            this.total_language = this.data_lanugages?.length;
            this.total_gradescore = this.grade_score?.length;

        });


    }

    listing(): void {
        this._service.view(this.id).subscribe({
            next: (res: any) => {
                this.data = res?.general;
                this.data_lanugages = this.data.languages;
                this.total_subjects = this.data.total_subjects;
                this.grade_score = this.data.grade_scores;
                this.total_language = this.data_lanugages.length;
                this.total_gradescore = this.grade_score.length;
                this._service.setProgram(res);
            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    Updatelisting(): void {
        this._service.view(this.id).subscribe({
            next: res => {
                this.data = res?.general;
                this.data_lanugages = this.data.languages;
                this.total_subjects = this.data.total_subjects;
                this.grade_score = this.data.grade_scores;

            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    update(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.data = { id: this.id, data: this.data };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(UpdateProgramComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.data.name = result.name;
                this.data.price_per_year = result.price_per_year;
                this.data.level = result.level;
            }
        });
    }

    updateScoreCategory(item): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.data = { id: this.id, data: item };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(UpdateScoreCategoryComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            this.listing();
        });
    }
    deleteLanguage(item: any) {
        const config: HelperConfirmationConfig = {
            title: 'បញ្ជាក់',
            message: `តើលោកអ្នកពិតជាចង់លុបភាសា ${item.name} មែនទេ?`,
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'លុប',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'បោះបង់',
                },
            },
            dismissible: false,
        }
        let confirm = this.confirmService.open(config);
        confirm.afterClosed().subscribe(result => {
            if (result == 'confirmed') {
                this._service.deleteLanguage(this.data.id, item.id).subscribe({
                    next: res => {
                        this._snackbarService.openSnackBar("ការលុបទទួលបានជោគជ័យ", GlobalConstants.success);
                        this.listing();
                    },
                    error: err => {
                        // this.isLoading = false;
                        this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
                    }
                });
            }
        });
    }

    create(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.data = { id: this.id, languages: this.data_lanugages };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(CreateSubjectComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.listing();
            }
        });
    }

    deleteScoreCategory(item: any) {
        this._service.deleteScoreCategory(item.grade_score_id).subscribe({
            next: res => {
                this._snackbarService.openSnackBar("ការលុបទទួលបានជោគជ័យ", GlobalConstants.success);
                this.listing();
            },
            error: err => {
                // this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    createScoreCategory(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.data = this.id;
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(AddScoreCategoryComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.listing();
            }
        });
    }
    updatePayment(item: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.data = { id: this.id, languages: this.data_lanugages, item: item };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(UpdatePaymentComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.listing();
            }
        });
    }
}
