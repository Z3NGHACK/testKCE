// =================================================================================================>> Core Library
import {
    Component,
    ElementRef,
    ViewChild,
    inject,
    Input,
    signal,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import {
    FormBuilder,
    Validators,
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    UntypedFormGroup,
    FormArray,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router, RouterLink } from '@angular/router';

// =================================================================================================>> Third Party Library
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import {
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import _moment from 'moment';

// =================================================================================================>> Custom Library
// Global Constand

// Helper

// Local
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { born_add, cur_add, per_info } from './interface';
import { KhmerDatePipe } from 'helper/pipes/khmer-date.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { ReceptionistService } from '../../receptionist.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateParentComponent } from './create-parent/component';
import { CreateHistoryComponent } from './create-history/component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { scheduled } from 'rxjs';
// import { MomentDateAdapter } from '@angular/material-moment-adapter';

/**
 * @title Stepper that displays errors in the steps
 */

const moment = _moment;
const MY_DATE_FORMAT = {
    parse: {
        dateInput: ['YYYY-MM-DD'],
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
@Component({
    selector: 'stepper-errors-example',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true, displayDefaultIndicatorType: false },
        },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    ],
    standalone: true,
    imports: [
        CommonModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        PortraitComponent,
        MatRadioModule,
        MatIconModule,
        MatCheckboxModule,
        MatMenuModule,
        NgClass,
        MatExpansionModule,
    ],
})
export class CreateComponent {
    @ViewChild('startDatePicker') dobDatePicker!: MatDatepicker<Date>;
    @ViewChild('endDatePicker') enrollDatePicker!: MatDatepicker<Date>;

    createStudent: UntypedFormGroup;
    personalInfoGroup: per_info;
    bornAddressGroup: born_add;
    currentAddressGroup: cur_add;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    parents: any = [];
    histories: any = [];
    grades: any = [];
    gradePrices: any = [];
    otherPayment: any = [];
    otherPaymentFullPrice: number = 0;
    fullPriceDollar: number = 0;
    fullPriceKHR: number = 0;
    src: string = 'images/avatars/avatar.jpeg';
    loading: boolean = false;
    khmerDatePipe: KhmerDatePipe;
    readonly panelOpenState = signal(false);
    readonly inPanelOpenState = signal(false);

    data: any = [];
    @ViewChild(MatStepper) stepper!: MatStepper;
    public stepperInd: number = 0;

    constructor(
        private _formBuilder: FormBuilder,
        private _snackBarService: SnackbarService,
        private _router: Router,
        private matDialog: MatDialog,
        private _adapter: DateAdapter<any>,
        private _service: ReceptionistService
    ) {
        this.firstFormGroup = this._formBuilder.group({
            avatar: [null, [Validators.required]],
            kh_name: [null, [Validators.required]],
            en_name: [null, [Validators.required]],
            sex_id: [null, [Validators.required]],
            dob: [null, [Validators.required]],
            nationality: [null, [Validators.required]],
            pob: [null, [Validators.required]],
            address: [null, [Validators.required]],
            sibling: [null, [Validators.required]],
            sport_activity: [null, [Validators.required]],
            allergy: [null, [Validators.required]],
            used_medicine: [null, [Validators.required]],
            medicine_name: [{ value: null, disabled: true }, []],
            parents: [null, [Validators.required]],
            disease_ids: this._formBuilder.array([], []),
            other: [null, []],
        });

        this.secondFormGroup = this._formBuilder.group({
            level_id: [null, [Validators.required]],
            grade_id: [null, [Validators.required]],
            academic_id: [null, [Validators.required]],
            study_history: [null, []],
            enroll_date: [null, [Validators.required]],
            student_languages: this._formBuilder.array([], []),
        });

        this.thirdFormGroup = this._formBuilder.group({
            other_payments: this._formBuilder.array([]),
        });
    }
    validateKhmerInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const validPattern = /[\u1780-\u17FF\u17E0-\u17E9\s]/g;
        const formControl = this.firstFormGroup.get('kh_name');

        const currentValue = formControl.value;
        if (currentValue) {
            if (validPattern.test(currentValue[currentValue.length - 1])) {
                // Ensure the length does not exceed 20 characters
                if (currentValue.length < 20) {
                    formControl.setValue(input.value, { emitEvent: false });
                }
            } else {
                // Remove the invalid character
                const updatedValue = currentValue.slice(0, -1);
                formControl.setValue(updatedValue, { emitEvent: false });
            }
        } else {
            formControl.setValue('', { emitEvent: false });
        }
        // Check the last character of the input

    }
    validateEnglishInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        // Regex pattern for English letters and spaces
        const validPattern = /^[a-zA-Z\s]*$/;
        const formControl = this.firstFormGroup.get('en_name'); // Replace with the actual control name for English input

        const currentValue = formControl.value;
        if (currentValue) {
            // Check the last character of the input
            if (validPattern.test(currentValue[currentValue.length - 1]) || currentValue.length === 0) {
                // Ensure the length does not exceed 20 characters
                if (currentValue.length < 20) {
                    formControl.setValue(input.value, { emitEvent: false });
                }
            } else {
                // Remove the invalid character
                const updatedValue = currentValue.slice(0, -1);
                formControl.setValue(updatedValue, { emitEvent: false });
            }
        } else {
            formControl.setValue('', { emitEvent: false });
        }
    }

    // data setup step 2

    ngAfterViewInit() {
        if (this.stepper) {
            this.stepper.selectionChange.subscribe((event) => {
                this.stepperInd = event.selectedIndex;
            });
        } else {
            console.error('MatStepper instance is undefined');
        }
    }

    ngOnInit(): void {
        this.ngBuilderForm();
        this._setupOnInit();
        this._adapter.setLocale('km-kh');
        this.setInputDisable();
        this.otherPaymentFullPrice;
    }

    getStepperClass() {
        if (this.stepperInd === 0) {
            return 'stepper-step-1';
        } else if (this.stepperInd === 1) {
            return 'stepper-step-2';
        } else if (this.stepperInd === 2) {
            return 'stepper-step-3';
        }
        return '';
    }

    setOtherPaymentPriceDiscount(): void {
        const items = this.getOtherPaymentsControls();
        items.controls.forEach((control, i) => {
            control.get('price').valueChanges.subscribe((value) => {
                value = Number(value);
                const discountValue = control.get('discount').value;
                if (
                    discountValue > 0 &&
                    discountValue &&
                    discountValue <= 100
                ) {
                    this.otherPayment[i].price =
                        value - (value * discountValue) / 100;
                } else {
                    this.otherPayment[i].price = value;
                }
                let j = 0;
                this.otherPaymentFullPrice = 0;
                this.otherPayment.forEach((price) => {
                    if (
                        (
                            this.thirdFormGroup.get(
                                'other_payments'
                            ) as FormArray
                        ).at(j).enabled
                    ) {
                        this.otherPaymentFullPrice =
                            this.otherPaymentFullPrice + price.price;
                    }
                    j++;
                });
                // this.fullPriceDollar = 0;
                // this.gradePrices.forEach(change => {
                //   this.fullPriceDollar = this.fullPriceDollar + change.realprice;
                // })
                // this.fullPriceDollar = this.fullPriceDollar + this.otherPaymentFullPrice;
                // this.fullPriceKHR = this.fullPriceDollar * this.data?.payment?.exchange_rate[0].number;
            });
            control.get('discount').valueChanges.subscribe((value) => {
                value = Number(value);
                const priceValue = control.get('price').value;
                if (value > 0 && priceValue && value <= 100) {
                    this.otherPayment[i].price =
                        priceValue - (value * priceValue) / 100;
                } else {
                    this.otherPayment[i].price = priceValue;
                }
                this.otherPayment[i].discount = value;
                this.otherPaymentFullPrice = 0;
                let j = 0;
                this.otherPayment.forEach((price) => {
                    if (
                        (
                            this.thirdFormGroup.get(
                                'other_payments'
                            ) as FormArray
                        ).at(j).enabled
                    ) {
                        this.otherPaymentFullPrice =
                            this.otherPaymentFullPrice + price.price;
                        j++;
                    }
                });

                // this.fullPriceDollar = 0;
                // this.gradePrices.forEach(change => {
                //   this.fullPriceDollar = this.fullPriceDollar + change.realprice;
                // })
                // this.fullPriceDollar = this.fullPriceDollar + this.otherPaymentFullPrice;
                // this.fullPriceKHR = this.fullPriceDollar * this.data?.payment?.exchange_rate[0].number;
            });
        });
    }

    getOtherPaymentsControls(): FormArray {
        return this.thirdFormGroup.get('other_payments') as FormArray;
    }

    setInputDisable(): void {
        this.firstFormGroup
            .get('used_medicine')
            ?.valueChanges.subscribe((value) => {
                const medicineControl =
                    this.firstFormGroup.get('medicine_name');
                if (value === true) {
                    medicineControl?.enable();
                } else {
                    medicineControl?.disable();
                    medicineControl?.reset(); // Optionally reset the value if disabled
                }
            });
    }

    private _setupOnInit(): void {
        this._service.setup().subscribe({
            next: (res) => {
                this.data = res.data;
                this.setupForm(this.data?.payment?.other_payments);
                this.setupSecondForm(this.data?.study?.academics);
                this.setupFormStudentLanguage(this.data?.payment?.languages);
                res.payment?.other_payments.forEach((discount) => {
                    discount.discount = 0;
                });
                this.otherPayment = res?.data?.payment?.other_payments;
            },
            error: (err) =>
                this._snackBarService.openSnackBar(
                    err?.error?.message || GlobalConstants.genericError,
                    GlobalConstants.error
                ),
        });
    }
    setupSecondForm(data: any[]): void {
        this.secondFormGroup.get('academic_id')?.setValue(data[0].id);
    }

    setupForm(data: any[]): void {
        const items = this.thirdFormGroup.get('other_payments') as FormArray;
        data.forEach((item) => {
            items.push(
                this._formBuilder.group({
                    income_id: [item.id],
                    price: [item?.price, []], // Initial validators can be empty
                    discount: [
                        null,
                        [
                            Validators.min(0),
                            Validators.max(100),
                            Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), // Validate numbers and decimals
                        ],
                    ],
                    note: [null, []],
                })
            );
        });

        items.disable();
        this.setOtherPaymentPriceDiscount();
    }

    setupFormStudentLanguage(data: any[]): void {
        const student_languages: FormArray = this.secondFormGroup.get(
            'student_languages'
        ) as FormArray;
        data.forEach((item) => {
            student_languages.push(
                this._formBuilder.group({
                    languages_id: [null],
                    schedule_id: [null, []], // Initial validators can be empty
                    step_id: [null, []],
                    discount: [null, []],
                    price: [null, []],
                })
            );
        });
        student_languages.controls.forEach((control, i) => {
            control.get('price').valueChanges.subscribe((value) => {
                this.fullPriceDollar = 0;
                this.gradePrices.forEach((change) => {
                    this.fullPriceDollar =
                        this.fullPriceDollar + parseInt(change.realprice);
                });
                this.fullPriceDollar =
                    this.fullPriceDollar + this.otherPaymentFullPrice;
                this.fullPriceKHR =
                    this.fullPriceDollar *
                    this.data?.payment?.exchange_rate[0].number;
            });
        });
    }
    calculateFullPrice() {
        this.fullPriceDollar = 0;
        this.gradePrices.forEach((change) => {
            this.fullPriceDollar += parseInt(change.realprice, 10);
        });
        this.fullPriceDollar += this.otherPaymentFullPrice;
        this.fullPriceKHR =
            this.fullPriceDollar * this.data?.payment?.exchange_rate[0]?.number;
    }
    onInputOtherPayment(i) {

        // console.log();
        this.otherPayment[i].price = (
            this.thirdFormGroup.get('other_payments') as FormArray
        )
            .at(i)
            .get('price').value;
        this.otherPayment[i].discount = (
            this.thirdFormGroup.get('other_payments') as FormArray
        )
            .at(i)
            .get('discount').value;
        this.calculateFullPrice();
    }
    toggleRequired(index: number): void {
        const control = (this.thirdFormGroup.get('other_payments') as FormArray)
            .at(index)
            .get('price');
        if (control?.hasValidator(Validators.required)) {
            (this.thirdFormGroup.get('other_payments') as FormArray)
                .at(index)
                .disable();
            control.clearValidators();
        } else {
            (this.thirdFormGroup.get('other_payments') as FormArray)
                .at(index)
                .enable();
            control.setValidators([
                Validators.required,
                Validators.pattern('^[0-9]*$'),
            ]);
        }
        control?.updateValueAndValidity();
    }

    get formArray(): FormArray {
        return this.thirdFormGroup.get('other_payments') as FormArray;
    }

    createPaymentGroup(): FormGroup {
        return this._formBuilder.group({
            checked: [false],
            price: [null, []],
            discount: [0],
            note: [null],
        });
    }

    ngBuilderForm(): void {
        this.createStudent = this._formBuilder.group({
            ...this.firstFormGroup.value,
            ...this.secondFormGroup.value,
            ...this.thirdFormGroup.value,
        });
    }

    onCheckboxChange(event: any) {
        const disease_ids: FormArray = this.firstFormGroup.get(
            'disease_ids'
        ) as FormArray;

        if (event.checked) {
            disease_ids.push(this._formBuilder.control(event.source.value));
        } else {
            const index = disease_ids.controls.findIndex(
                (x) => x.value === event.source.value
            );
            disease_ids.removeAt(index);
        }
    }

    onCheckboxLanguage(event: any, index: number) {
        const student_languages: FormArray = this.secondFormGroup.get(
            'student_languages'
        ) as FormArray;

        if (event.checked) {
            student_languages
                .at(index)
                .patchValue({ languages_id: event.source.value, schedule_id: 1 });

            this.data.payment.languages[index].checked = true;
        } else {
            student_languages.at(index).patchValue({ languages_id: null });
            this.data.payment.languages[index].checked = false;
        }
        this.addPrice();
    }

    addPrice(): void {
        this.gradePrices = [];
        const grade_id = this.secondFormGroup.value.grade_id;
        if (grade_id) {
            const student_languages =
                this.secondFormGroup.value.student_languages;
            student_languages.forEach((language) => {
                const language_id = language.languages_id;
                if (language_id) {
                    const param: any = {
                        grade_id: grade_id,
                        language_id: language_id,
                    };
                    this._service
                        .setUpPriceLanguage(param)
                        .subscribe((res: any) => {
                            res.realprice = 0;
                            res.step = null;
                            res.dicount = 0;
                            res.steps.forEach((set) => {
                                set.discount = 0;
                                set.checked = false;
                            });
                            this.gradePrices.push(res);
                        });
                }
            });
        }
        this.calculateFullPrice();

    }

    onRadioChange(languageId: number, scheduleId: number) {

        const student_languages: FormArray = this.secondFormGroup.get(
            'student_languages'
        ) as FormArray;

        // Find the index of the entry that needs to be updated
        const index = student_languages.controls.findIndex(
            (control) => control.value.languages_id === languageId
        );

        if (index !== -1) {
            // Update the existing entry with the selected schedule
            student_languages.at(index).patchValue({ schedule_id: scheduleId });
        }
    }

    onRadioSetStep(languageId: number, step: any, gradeprice: any, i: number) {
        const student_languages: FormArray = this.secondFormGroup.get(
            'student_languages'
        ) as FormArray;

        // Find the index of the entry that needs to be updated
        const index = student_languages.controls.findIndex(
            (control) => control.value.languages_id === languageId
        );

        if (index !== -1) {
            gradeprice.step = step.name;
            gradeprice.discount = step.discount;
            gradeprice.realprice = step.price;
            gradeprice.steps.forEach((check) => {
                if (check.id == step.id) {
                    check.checked = true;
                } else {
                    check.checked = false;
                }
            });
            // Update the existing entry with the selected step and calculated price
            student_languages.at(index).patchValue({
                step_id: step.id,
                discount: step.discount,
                price: step.price,
            });
        }
    }

    onRadioSetDiscount(
        languageId: number,
        discount: any,
        gradeprice: any,
        step: any
    ) {
        const student_languages: FormArray = this.secondFormGroup.get(
            'student_languages'
        ) as FormArray;

        // Find the index of the entry that needs to be updated
        const index = student_languages.controls.findIndex(
            (control) => control.value.languages_id === languageId
        );

        if (index !== -1) {
            gradeprice.discount = discount.percentage;
            gradeprice.realprice = discount.price;
            step.discount = discount.percentage;
            step.price = discount.price;
            // Update the existing entry with the selected step and calculated price
            student_languages.at(index).patchValue({
                discount: discount.percentage,
                price: discount.price,
            });
        }
    }
    is_change_cover: boolean = false;
    srcChange(base64: string): void {
        this.is_change_cover = true;
        this.src = base64;
        this.firstFormGroup.get('avatar').setValue(base64);
    }

    selectCoverFile(): void {
        const fileInput = document.getElementById(
            'portrait-fileCover'
        ) as HTMLInputElement;
        fileInput.click();
    }

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = e.target.result;
                this.srcChange(base64);
            };
            reader.readAsDataURL(file);
        }
    }
    is_click_create_parent: boolean = false;
    createParentDialog(): void {
        this.is_click_create_parent = true;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            parents: this.parents,
        };
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        const dialogRef = this.matDialog.open(
            CreateParentComponent,
            dialogConfig
        );
        dialogRef.componentInstance.createParent.subscribe((response: any) => {
            this.parents.push(response);
            const parents: any = [];
            this.parents.map((parent) => {
                parents.push({
                    name: parent.name,
                    job: parent.job,
                    relation: parent.relation,
                    phone1: parent.phone1,
                    phone2: parent.phone2,
                    facebook: parent.facebook,
                    address: parent.address,
                    email: parent.email,
                    telegram: parent.telegram,
                });
            });
            this.is_click_create_parent = false;
            this.firstFormGroup.get('parents').setValue(parents);
        });
    }

    updateParentDialog(parent: any): void {
        // Find the index of the parent if it exists
        const parentIndex = this.parents.findIndex(
            (p: any) => p.id === parent.id
        );
        const validateParents = this.parents.filter(
            (p: any) => p.id != parent.id
        );

        // If parent is found, remove it from the array
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { parent, parents: validateParents };
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        const dialogRef = this.matDialog.open(
            CreateParentComponent,
            dialogConfig
        );
        dialogRef.componentInstance.createParent.subscribe((response: any) => {
            if (parentIndex !== -1) {
                this.parents.splice(parentIndex, 1);
            }
            this.parents.push(response);
            const parents: any = [];
            this.parents.map((parent) => {
                parents.push({
                    name: parent.name,
                    job: parent.job,
                    relation: parent.relation,
                    phone1: parent.phone1,
                    phone2: parent.phone2,
                    facebook: parent.facebook,
                    address: parent.address,
                    email: parent.email,
                    telegram: parent.telegram,
                });
            });
            this.firstFormGroup.get('parents').setValue(parents);
        });
    }

    deleteParent(parent: any): void {
        // Find the index of the parent if it exists
        const parentIndex = this.parents.findIndex(
            (p: any) => p.id === parent.id
        );

        // If parent is found, remove it from the array
        if (parentIndex !== -1) {
            this.parents.splice(parentIndex, 1);
            const parents: any = [];
            this.parents.map((parent) => {
                parents.push({
                    name: parent.name,
                    job: parent.job,
                    relation: parent.relation,
                    phone1: parent.phone1,
                    phone2: parent.phone2,
                    facebook: parent.facebook,
                    address: parent.address,
                    email: parent.email,
                    telegram: parent.telegram,
                });
            });
            this.firstFormGroup.get('parents').setValue(parents);
        }
        this._snackBarService.openSnackBar(
            'Parent ' + parent.name + ' has been deleted!',
            ''
        );
    }

    createHistoryDialog(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = this.data.education.general.levels;
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        const dialogRef = this.matDialog.open(
            CreateHistoryComponent,
            dialogConfig
        );
        dialogRef.componentInstance.createHistory.subscribe((response: any) => {
            const histories: any = [];
            this.histories.push(response)
            this.histories.map((historie) => {
                histories.push({
                    level_id: historie.level_id,
                    start_grade_id: historie.start_grade_id,
                    end_grade_id: historie.end_grade_id,
                    school_name: historie.school_name,
                    start_date: historie.start_date,
                    end_date: historie.end_date,
                });
            });
            this.secondFormGroup.get('study_history').setValue(histories);
        });
    }

    deleteHistory(history: any): void {
        // Find the index of the parent if it exists
        const historyIndex = this.histories.findIndex(
            (p: any) => p.id === history.id
        );

        // If parent is found, remove it from the array
        if (historyIndex !== -1) {
            this.histories.splice(historyIndex, 1);
            const histories: any = [];
            this.histories.map((historie) => {
                historie.push({
                    level_id: historie.level_id,
                    start_grade_id: historie.start_grade_id,
                    end_grade_id: historie.end_grade_id,
                    school_name: historie.school_name,
                    start_date: historie.start_date,
                    end_date: historie.end_date,
                });
            });
            this.secondFormGroup.get('study_history').setValue(histories);
        }
        this._snackBarService.openSnackBar(
            'Study history has been deleted!',
            ''
        );
    }

    gradeHandler(item: any) {
        this.grades = item.grades;
    }

    chosenDobHandler(event: any) {
        const date = event._d;
        this.firstFormGroup
            .get('dob')
            ?.setValue(moment(date).format('DD-MM-YYYY'));
    }

    chosenEnrollHandler(event: any, datepicker: MatDatepicker<Date>) {
        const date = event._d;
        this.secondFormGroup
            .get('enroll_date')
            ?.setValue(moment(date).format('DD-MM-YYYY'));
        datepicker.close();
    }

    setCreateStudentValue(): void {
        const dob = this.firstFormGroup.value.dob;
        let firstFormGroupValues = { ...this.firstFormGroup.value };
        if (dob) {
            firstFormGroupValues = {
                ...firstFormGroupValues,
                dob: moment(dob._d).format('YYYY-MM-DD'),
            };
        }

        const enroll_date = this.secondFormGroup.value.enroll_date;
        let secondFormGroupValues = { ...this.secondFormGroup.value };
        if (enroll_date) {
            secondFormGroupValues = {
                ...secondFormGroupValues,
                enroll_date: moment(enroll_date._d).format('YYYY-MM-DD'),
            };
        }

        // Filter enabled controls for thirdFormGroup
        const otherPaymentsArray = this.thirdFormGroup.get(
            'other_payments'
        ) as FormArray;
        const enabledOtherPayments = otherPaymentsArray.controls
            .filter((control) => control.enabled)
            .map((control) => control.value);

        const thirdFormGroupValues = {
            ...this.thirdFormGroup.value,
            other_payments: enabledOtherPayments,
        };

        // Filter valid student_languages
        const studentLanguagesArray = this.secondFormGroup.get(
            'student_languages'
        ) as FormArray;
        const validStudentLanguages = studentLanguagesArray.controls
            .filter((control) => {
                const { languages_id, schedule_id, step_id, price } =
                    control.value;
                return (
                    languages_id !== null &&
                    schedule_id !== null &&
                    step_id !== null &&
                    price !== null
                );
            })
            .map((control) => control.value);

        secondFormGroupValues = {
            ...secondFormGroupValues,
            student_languages: validStudentLanguages,
        };

        // Set values to createStudent
        this.createStudent.setValue({
            ...firstFormGroupValues,
            ...secondFormGroupValues,
            ...thirdFormGroupValues,
        });
    }

    submit(): void {
        this.setCreateStudentValue();

        const body = this.createStudent.value;

        this._service.createStudent(body).subscribe({
            next: (res) => {
                this._router.navigateByUrl('/receptionist/students/listing');
                this._snackBarService.openSnackBar(
                    res.message,
                    GlobalConstants.success
                );
            },
            error: (err) => {
                let message: string =
                    err.error.message ?? GlobalConstants.genericError;
                this._snackBarService.openSnackBar(
                    message,
                    GlobalConstants.error
                );
            },
        });
    }
    validStudentLanguagesCount(): number {
        const studentLanguagesArray = this.secondFormGroup.get(
            'student_languages'
        ) as FormArray;
        return studentLanguagesArray.controls.filter(control => {
            const { languages_id, schedule_id, step_id, price } = control.value;
            return (
                languages_id !== null &&
                schedule_id !== null &&
                step_id !== null &&
                price !== null
            );
        }).length;
    }
    stepControll() {
        this.is_click_create_parent = true;
        this.is_change_cover = true;
    }
    back(): void {
        this._router.navigateByUrl(`/receptionist/students/listing`);
    }
}
