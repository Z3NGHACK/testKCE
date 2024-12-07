import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabContent, MatTabsModule } from '@angular/material/tabs';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { BranchService } from '../branch.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'helper/shared/constants';
import { BranchGeneralComponent } from './general/general.component';
import { BranchPaymentComponent } from './payment/payment.component';
import { BranchClassroomComponent } from './classroom/classroom.component';
import { BranchTeacherStaffComponent } from './teacher-staff/teacher.staff.component';

@Component({
    selector: 'general-manager-view-branch',
    standalone: true,
    imports: [
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        MatTabContent,
        BranchGeneralComponent,
        BranchPaymentComponent,
        BranchClassroomComponent,
        BranchTeacherStaffComponent,
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss'
})
export class ViewBranchComponent {
    
    public id: number;
    public name: string;  
    
    constructor(
        private _snackbarService: SnackbarService,
        private _service: BranchService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
    }
    ngOnInit(): void {
        this._activatedRoute.paramMap.subscribe(params => {
            this.id = +params.get('id'); 
        });
        this.listing();
    }
    
    back(): void {
        this._router.navigateByUrl(`branch`)
    }

    listing():void {
        const param: { month?: string , income_month?: string ,primary_income_month?: string } = {};

        // if (this.firstFormGroup.get('month').value != '') {
        //     param.month = this.firstFormGroup.get('month').value;
        // }

        
        // if (this.firstFormGroup.get('primary_income_month').value != '') {
        //     param.primary_income_month = this.firstFormGroup.get('primary_income_month').value;
        // }

        // if (this.firstFormGroup.get('income_month').value != '') {
        //     param.income_month = this.firstFormGroup.get('income_month').value;
        // }


         this._service.view(this.id , param).subscribe({
            next: res => {
                this.name = res?.name;
                // this.isLoading = false;
            },
            error: err => {
                // this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    
}
