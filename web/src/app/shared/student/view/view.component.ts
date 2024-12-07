// ================================================================>> Core Library
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// ================================================================>> Third-Party Library
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabContent, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { GlobalConstants } from 'helper/shared/constants';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';

// ================================================================>> Custom Library Librarys

import { MatIconModule } from '@angular/material/icon';
import { helperAnimations } from 'helper/animations';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { SharedStudentService } from '../student.service';
import { env } from 'envs/env';
import { SharedStudentDetailsComponent } from './general/detail/detail.component';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { General, Payment, View } from '../student.types';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { StudentGeneralComponent } from './general/general.component';
import { StudentFileComponent } from './file/file.component';
import { StudentClassroomComponent } from './classroom/classroom.component';
import { SharedStudentPaymentComponent } from './payment/payment.component';

@Component({
    selector: 'shared-view-student',
    standalone: true,
    imports: [
        MatTabsModule,
        MatIconModule,
        PortraitComponent,
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
        StudentGeneralComponent,
        StudentFileComponent,
        StudentClassroomComponent,
        SharedStudentPaymentComponent,
        MatTabContent,
    ],
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
    
})
export class SharedViewStudentComponent {

    // ================================================================>> varable for sevice
    public data: General;
    public payment: Payment;
    public classroom: any;
    path: 'receptionist' | 'general-manager';
    public id: number;
    fileUrl: string = env.FILE_BASE_URL;
    branch_id: number = 0;
    branches: { id: number, name: string }[] = [];


    public setupData: any[] = [];
    public otherPayment: any[] = [];
    public paymentGroup: FormGroup;
    public attechemnts = [];
    public dataSource: any[];
    displayedColumns: string[] = ['code', 'total_price', 'receiver', 'date', 'payment_status', 'action'];
    activeStep: any;
    selectedStep: any;
    gradePrices: any = [] = [];
    readonly panelOpenState = signal(false);
    readonly inPanelOpenState = signal(false);

    // ================================================================>> full price for other payment
    public otherPaymentFullPrice: number = 0;
    fullPriceDollar: number = 0;
    fullPriceKHR: number = 0;
    public exchange_rate: any[] = [];
    loading: boolean = true;
    loadingPayment: boolean = true;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _matDialog: MatDialog,
        private _studentService: SharedStudentService,
        private _snackbarService: SnackbarService,
        private _formBuilder: FormBuilder
    ) {
        this.path = this._activatedRoute.snapshot.data.from;

        this.paymentGroup = this._formBuilder.group({
            grade_id: [null, [Validators.required]],
            student_languages: this._formBuilder.array([], []),
            other_payments: this._formBuilder.array([]),
        });



    }

    ngOnInit(): void {
        // ================================================================>> get id from the url for view student detail
        this._activatedRoute.paramMap.subscribe(params => {
            this.id = +params.get('id');
        });

        this.findDataSetupCreate();
        this.view();

    }

    // ================================================================>> go back to listing
    back(): void {
        this.path === 'receptionist'
            ? this._router.navigateByUrl(`${this.path}/students/listing`)
            : this._router.navigateByUrl(`/student`);
    }
    async findDataSetupCreate(): Promise<void> {
        this.loadingPayment = true;
        await this._studentService.setup().subscribe({
            next: res => {
                res.payment?.other_payments.forEach(discount => {
                    discount.discount = 0;
                })
                this.otherPayment = res?.data?.payment?.other_payments;

                this.loadingPayment = false;
            },

        });
    }


    getOtherPaymentsControls(): FormArray {
        return this.paymentGroup.get('other_payments') as FormArray;
    }

    // ================================================================>> view student detail sevice calling
    async view(): Promise<void> {
        this.loading = true;
        await this._studentService.view(this.path, this.id).subscribe({
            next: res => {
                this.data = res.general;
                this.payment = res.payment;
                this.classroom = res.classroom;
                this.attechemnts = res.attechments;

                this.loading = false;
            },
            error: err => {
                console.log(err)
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }

        });



    }

}
