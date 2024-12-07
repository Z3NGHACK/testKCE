import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedStudentService } from '../../student.service';
import { GlobalConstants } from 'helper/shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { SharedCreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { SharedViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { firstValueFrom } from 'rxjs';

interface OtherPayment {
    id: number;
    price: number;
    discount: number;
    note?: string;
    checked: boolean;
}

@Component({
    selector: 'shared-student-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
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
    ],
})
export class SharedStudentPaymentComponent implements OnInit {
    @Input() data: any;
    @Input() otherPayment: OtherPayment[] = [];

    public paymentGroup: FormGroup;
    public gradePrices: any[] = [];
    public otherPaymentFullPrice: number = 0;
    public fullPriceDollar: number = 0;
    public dataSource: any[];
    displayedColumns: string[] = [
        'code',
        'total_price',
        'receiver',
        'date',
        'payment_status',
        'action',
    ];
    readonly panelOpenState = signal(false);
    readonly inPanelOpenState = signal(false);

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _matDialog: MatDialog,
        private _studentService: SharedStudentService,
        private _snackbarService: MatSnackBar,
        private _formBuilder: FormBuilder
    ) {
        this.paymentGroup = this._formBuilder.group({
            grade_id: [null, [Validators.required]],
            student_languages: this._formBuilder.array([]),
            other_payments: this._formBuilder.array([]),
        });
    }

    ngOnInit(): void {
        this.dataSource = this.data.invoices;
        this.fetchsetupDataPrice();

        this.otherPayment.forEach((other) => {
            let find = this.data.other_payments.find(
                (o) => o.step.id === other.id
            );

            if (find) {
                other.checked = true;
                other.discount = find.discount;
                other.price = find.price;

                other.note = find.note || '';
            }
        });

        // Log the updated otherPayment array for debugging purposes

        // Setup the form with the updated otherPayment array
        this.setupForm(this.otherPayment || []);
        this.otherPayment.forEach((d, i) => {
            if (d.checked) {
                d.checked = false;
                this.onInputOtherPayment(i);
                this.toggleRequired(i);
            }
        });
    }

    private async fetchsetupDataPrice(): Promise<void> {
        try {
            const gradePricesSetup = await Promise.all(
                [1, 2, 3].map((i) =>
                    this._studentService
                        .setupPrice(this.data.grade_id, i)
                        .toPromise()
                )
            );
            this.gradePrices = gradePricesSetup;

            this.data.step_payments.forEach((d, index) => {
                const step = this.gradePrices[index].steps.find(
                    (s) => s.id == d.step.id
                );
                this.onCheckboxToggle(
                    d.student_language.language_id,
                    {
                        id: d.step.id,
                        name: d.step.name,
                        discount: d.payment_discount,
                        price: d.price,
                    },
                    this.gradePrices[index],
                    null
                );
                this.onDiscountCheckboxToggle(
                    d.student_language.language_id,
                    {
                        id: d?.payment_discount?.id,
                        percentage: d?.payment_discount?.percentage,
                        price: d.price,
                    },
                    this.gradePrices[index],
                    step,
                    null,
                    true
                );
            });
        } catch (err) {
            console.log(err);
            this._snackbarService.open(GlobalConstants.genericError, 'Error');
        }
    }

    get otherPaymentsControls(): FormArray {
        return this.paymentGroup.get('other_payments') as FormArray;
    }

    private setupForm(data: OtherPayment[]): void {
        const formArray = this.paymentGroup.get('other_payments') as FormArray;
        formArray.clear(); // Clear any existing controls
        data.forEach((item) => {
            if (!item.checked) {
                item.checked = false;
            }
            formArray.push(
                this._formBuilder.group({
                    income_id: [item.id],
                    price: [item.price, Validators.required],
                    discount: [
                        item.discount,
                        [Validators.max(100), Validators.pattern('^[0-9]*$')],
                    ],
                    note: [item.note],
                })
            );
        });
        formArray.disable();
        this.calculateTotalPriceAndDiscount();
    }

    private calculateTotalPriceAndDiscount(): void {
        this.otherPaymentsControls.controls.forEach((control, index) => {
            control
                .get('price')
                .valueChanges.subscribe((value) =>
                    this.updatePrice(index, value)
                );
            control
                .get('discount')
                .valueChanges.subscribe((value) =>
                    this.updateDiscount(index, value)
                );
        });
    }

    private updatePrice(index: number, price: number): void {
        price = Number(price);
        const discountValue = this.otherPaymentsControls
            .at(index)
            .get('discount').value;
        if (discountValue > 0 && discountValue <= 100) {
            this.otherPayment[index].price =
                price - (price * discountValue) / 100;
        } else {
            this.otherPayment[index].price = price;
        }
        this.updateFullPrice();
    }

    private updateDiscount(index: number, discount: number): void {
        const priceValue = this.otherPaymentsControls
            .at(index)
            .get('price').value;
        if (discount > 0 && discount <= 100) {
            this.otherPayment[index].price =
                priceValue - (priceValue * discount) / 100;
        } else {
            this.otherPayment[index].price = priceValue;
        }
        this.otherPayment[index].discount = discount;
        this.updateFullPrice();
    }

    private updateFullPrice(): void {
        this.otherPaymentFullPrice = this.otherPayment
            .filter((_, i) => this.otherPaymentsControls.at(i).enabled)
            .reduce((total, item) => total + item.price, 0);

        this.fullPriceDollar =
            this.gradePrices.reduce(
                (total, gradePrice) => total + gradePrice.realprice,
                0
            ) + this.otherPaymentFullPrice;
    }

    onCheckboxToggle(
        languageId: number,
        step: any,
        gradeprice: any,
        scheduleId: number
    ): void {
        if (!step.checked) {
            const studentLanguages = this.paymentGroup.get(
                'student_languages'
            ) as FormArray;
            const index = studentLanguages.controls.findIndex(
                (control) => control.value.languages_id === languageId
            );
            gradeprice.step = step.name;
            gradeprice.discount = 0;
            gradeprice.realprice = 0;
            gradeprice.steps.forEach(
                (check) => (check.checked = check.id === step.id)
            );
            gradeprice.steps.forEach((check) => {
                if (check.id === step.id) {
                    step.discount = 0;
                    check.discounts.forEach((dis) => (dis.selected = false));
                }
            });
            const entryData = {
                languages_id: languageId,
                schedule_id: scheduleId,
                step_id: step.id,
                discount: 0,
                price: step.price ?? 0,
            };
            if (index !== -1) {
                studentLanguages.at(index).patchValue(entryData);
            } else {
                studentLanguages.push(this._formBuilder.group(entryData));
            }
        } else {
            const studentLanguages = this.paymentGroup.get(
                'student_languages'
            ) as FormArray;
            const index = studentLanguages.controls.findIndex(
                (control) => control.value.languages_id === languageId
            );
            gradeprice.step = step.name;
            gradeprice.discount = step.discount ?? 0;
            gradeprice.realprice = step.price ?? 0;
            gradeprice.steps.forEach(
                (check) => (check.checked = check.id === step.id)
            );

            const entryData = {
                languages_id: languageId,
                schedule_id: scheduleId,
                step_id: step.id,
                discount: step.discount ?? 0,
                price: step.price ?? 0,
            };

            if (index !== -1) {
                studentLanguages.at(index).patchValue(entryData);
            } else {
                studentLanguages.push(this._formBuilder.group(entryData));
            }
            console.log(this.paymentGroup.value);
        }
    }

    onDiscountCheckboxToggle(
        languageId: number,
        discount: any,
        gradeprice: any,
        step: any,
        scheduleId: number,
        first?: any
    ): void {
        let validate = false;
        gradeprice.steps.forEach((check) => {
            if (check.id === step.id) {
                check.discounts.forEach((dis) => {
                    if (dis.percentage === discount?.percentage) {
                        if (!first) {
                            validate = dis.selected;
                        } else {
                            validate = true;
                        }
                    }
                });
            }
        });
        if (validate) {
            const studentLanguages = this.paymentGroup.get(
                'student_languages'
            ) as FormArray;
            const index = studentLanguages.controls.findIndex(
                (control) => control.value.languages_id === languageId
            );

            gradeprice.discount = discount?.percentage ?? 0;
            gradeprice.realprice = discount?.price ?? 0;
            step.discount = discount?.percentage ?? 0;
            step.price = discount?.price ?? 0;

            gradeprice.steps.forEach((check) => {
                if (check.id === step.id) {
                    check.discounts.forEach(
                        (dis) =>
                        (dis.selected =
                            dis.percentage === discount?.percentage)
                    );
                }
            });

            const entryData = {
                languages_id: languageId,
                schedule_id: scheduleId,
                step_id: step.id,
                discount: discount?.percentage ?? 0,
                price: discount?.price ?? 0,
            };

            if (index !== -1) {
                studentLanguages.at(index).patchValue(entryData);
            } else {
                studentLanguages.push(this._formBuilder.group(entryData));
            }
        } else {
            const studentLanguages = this.paymentGroup.get(
                'student_languages'
            ) as FormArray;
            const index = studentLanguages.controls.findIndex(
                (control) => control.value.languages_id === languageId
            );

            gradeprice.discount = 0;
            gradeprice.realprice = discount?.price ?? 0;
            step.discount = 0;
            step.price = discount?.price ?? 0;

            gradeprice.steps.forEach((check) => {
                if (check.id === step.id) {
                    check.discounts.forEach(
                        (dis) =>
                        (dis.selected =
                            dis.percentage === discount?.percentage)
                    );
                }
            });

            const entryData = {
                languages_id: languageId,
                schedule_id: scheduleId,
                step_id: step.id,
                discount: 0,
                price: discount?.price ?? 0,
            };

            if (index !== -1) {
                studentLanguages.at(index).patchValue(entryData);
            } else {
                studentLanguages.push(this._formBuilder.group(entryData));
            }
        }
    }
    createInvoice() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = this.paymentGroup.value;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            SharedCreateInvoiceComponent,
            dialogConfig
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.updatePaymentGroup(result);
            }
        });
    }

    async viewPayment(item): Promise<void> {
        let res: any;

        // Convert the observable to a promise using firstValueFrom
        try {
            res = await firstValueFrom(
                this._studentService.viewInvoice(item.id)
            );
        } catch (error) {
            console.error('Error fetching invoice:', error);
            return; // Exit if there is an error
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {data: res.data , path: 'receptionist'} // Pass the data to the dialog
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            SharedViewInvoiceComponent,
            dialogConfig
        );

        // Handle the dialog result
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.data.invoices.forEach((item) => {
                    if (result.id == item.id) {
                        item.status.id = 2;
                        item.status.name = 'បានទូទាត់';
                    }
                });
                this.dataSource = this.data.invoices;
            }
        });
    }
    private updatePaymentGroup(data: any): void {
        this.paymentGroup.patchValue({
            grade_id: data.grade_id,
            student_languages: data.student_languages,
        });

        const studentLanguagesArray = this.paymentGroup.get(
            'student_languages'
        ) as FormArray;
        studentLanguagesArray.clear();
        data.student_languages.forEach((language: any) => {
            studentLanguagesArray.push(this._formBuilder.control(language));
        });
    }

    submitForm(): void {
        if (this.paymentGroup.invalid) {
            this.paymentGroup.markAllAsTouched();
            return;
        }
        // this._studentService.submitPaymentData(this.paymentGroup.value).subscribe({
        //   next: () => this._snackbarService.open('Payment data submitted successfully!', 'Success'),
        //   error: (err) => this._snackbarService.open(GlobalConstants.genericError, 'Error')
        // });
    }
    onInputOtherPayment(i) {
        // console.log();
        this.otherPayment[i].price = (
            this.paymentGroup.get('other_payments') as FormArray
        )
            .at(i)
            .get('price').value;
        this.otherPayment[i].discount = (
            this.paymentGroup.get('other_payments') as FormArray
        )
            .at(i)
            .get('discount').value;
    }
    toggleRequired(index: number): void {
        if (!this.otherPayment[index].checked) {
            this.otherPayment[index].checked = true;
        } else {
            this.otherPayment[index].checked = false;
        }
        const control = (this.paymentGroup.get('other_payments') as FormArray)
            .at(index)
            .get('price');
        if (control?.hasValidator(Validators.required)) {
            (this.paymentGroup.get('other_payments') as FormArray)
                .at(index)
                .enable();
            control.clearValidators();
        } else {
            (this.paymentGroup.get('other_payments') as FormArray)
                .at(index)
                .disable();
            control.setValidators([
                Validators.required,
                Validators.pattern('^[0-9]*$'),
            ]);
        }
        control?.updateValueAndValidity();

    }
}
