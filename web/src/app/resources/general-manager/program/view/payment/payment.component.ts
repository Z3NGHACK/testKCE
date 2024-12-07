import { Component, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabContent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedViewTeacherComponent } from 'app/shared/teacher/view/view.component';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { Program, ProgramService } from '../../program.service';
import { General, GradeScore, Language, Payment } from '../../program.interface';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { distinctUntilChanged, Subscription } from 'rxjs';

@Component({
    selector: 'general-manager-view-program-payment',
    standalone: true,
    imports: [
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        MatTabContent,
        CommonModule,
        MatExpansionModule
    ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss'
})
export class ProgramPaymentComponent {
    @Input() id: number;
    public data: Program.IPayment[];
    readonly panelOpenState = signal(false);

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
        this._service.getProgram().pipe(distinctUntilChanged()).subscribe((res) => {
            this.data = res?.payments;
            this.data?.map((s) => s?.steps?.sort((a, b) => a.id - b.id));
        });
    }


}
