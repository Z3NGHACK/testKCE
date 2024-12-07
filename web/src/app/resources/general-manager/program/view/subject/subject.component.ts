import { Component, input, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabContent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedViewTeacherComponent } from 'app/shared/teacher/view/view.component';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { ProgramService } from '../../program.service';
import { General, GradeScore, Language, Subject, SubjectLanguage } from '../../program.interface';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { CreateSubjectDialogComponent } from './create/create.component';
import { distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'general-manager-view-program-subject',
    standalone: true,
    imports: [
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        MatTabContent,
        CommonModule,
        MatMenuModule,
    ],
    templateUrl: './subject.component.html',
    styleUrl: './subject.component.scss'
})
export class ProgramSubjectComponent implements OnInit, OnChanges {
    @Input() id: number;
    @Input() updateData: Language[];
    public data: SubjectLanguage[] = []; // Initialize as an empty array

    constructor(
        private _snackbarService: SnackbarService,
        private _service: ProgramService,
        private _activatedRoute: ActivatedRoute,
        private _matDialog: MatDialog
    ) { }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnInit(): void {

        this._service.getProgram().pipe(distinctUntilChanged()).subscribe((res: any) => {
            this.data = res?.subjects.languages;
        })

    }

    listing(): void {
        this._service.view(this.id).subscribe({
            next: (res: any) => {
                this.data = res?.subjects.languages;
                this._service.setProgram(res);
            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    delete(item: any) {
        this._service.deleteSubject(item.id).subscribe({
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

    create(item: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.data = { data: item, id: this.id };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(CreateSubjectDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(() => {
            this.listing();
        });
    }

}
