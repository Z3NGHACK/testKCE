import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabContent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedViewTeacherComponent } from 'app/shared/teacher/view/view.component';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { ProgramGeneralComponent } from './general/general.component';
import { Program, ProgramService } from '../program.service';
import { General, Language } from '../program.interface';
import { GlobalConstants } from 'helper/shared/constants';
import { ProgramPaymentComponent } from './payment/payment.component';
import { ProgramSubjectComponent } from './subject/subject.component';
import { promises } from 'dns';

@Component({
    selector: 'general-manager-view-program',
    standalone: true,
    imports: [
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        MatTabContent,
        ProgramGeneralComponent,
        ProgramPaymentComponent,
        ProgramSubjectComponent
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss'
})
export class ProgramViewComponent {
    public id: number;
    public data: General;
    public updateData: Language[];

    constructor(
        private _snackbarService: SnackbarService,
        private _service: ProgramService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
    }
    ngOnInit(): void {
        this._activatedRoute.paramMap.subscribe(params => {
            this.id = +params.get('id');
        });
        this.listing()
    }

    back(): void {
        this._router.navigateByUrl(`program`)
    }

    onUpdateData(updatedLanguages: Language[]): void {
        this.updateData = updatedLanguages;
        console.log("data have been receive", this.updateData)
    }

    listing(): void {

        this._service.view(this.id).subscribe({
            next: (res: any) => {
                this.data = res?.general;
                this._service.setProgram(res);
                // this.isLoading = false;
            },
            error: err => {
                // this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

}





