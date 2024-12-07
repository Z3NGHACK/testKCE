import { CommonModule, NgClass, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import {env} from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    standalone: true,
    imports: [
        // RouterLink,
        FormsModule,
        CommonModule,
        NgIf,NgClass,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
    selector: 'verify-otp-password',
    templateUrl: 'otp.component.html',
    styleUrls: ['./otp.component.scss'],
})

export class VerifyOTPAndPasswordComponent implements OnInit {
    private _unsubscribeAll: Subject<void> = new Subject<void>();
    @ViewChild('input1') input1: ElementRef;
    @ViewChild('input2') input2: ElementRef;
    @ViewChild('input3') input3: ElementRef;
    @ViewChild('input4') input4: ElementRef;
    @ViewChild('input5') input5: ElementRef;
    @ViewChild('input6') input6: ElementRef;

    isOtpForm: boolean[] = [true,false,false]; //[otp,password,2fa]

    public token: string = '';
    public numStr1: string = '1';
    public numStr2: string = '2';
    public numStr3: string = '3';
    public numStr4: string = '4';
    public numStr5: string = '5';
    public numStr6: string = '6';
    public otpCode: string = '123456';
    public remainingTime: number = 0;
    public reSendOtp: boolean = false;
    public isLoading: boolean = false;
    public countdownInterval: any;
    public phone: string = '';
    public canSubmit: boolean = true;

    otp_id: string = '';
    temp2fa: string = '';

    passwordForm: FormGroup;

    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _snackbarService: SnackbarService,
    ) { }

    ngOnInit() { 
        
        this.remainingTime = 60;
        this.startCountdown();

        // this._authService.phone$.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: { phone: string }) => {
        //     this.phone = data.phone;
        // });
        // if (!this.phone) {
        //     this._snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
        //     this._router.navigateByUrl('/auth/sign-in');
        //     return;
        // }

        //requesting otp as soon as we enter verify otp page
        // this._authService.requestOtp(this.phone).subscribe( res => this._snackbarService.openSnackBar(res.message, GlobalConstants.success));

        this.passwordForm = this._formBuilder.group({
            password: [null, Validators.required],
        });
    }


    startCountdown() {
        this.remainingTime -= 1;
        this.countdownInterval = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--;
            } else {
                clearInterval(this.countdownInterval);
                this.reSendOtp = true;
                this.numStr1 = this.numStr2 = this.numStr3 = this.numStr4 = this.numStr5 = this.numStr6 = '';
                this.canSubmit = false;
            }
        }, 1000);
    }

    toLogin(): void {
        clearInterval(this.countdownInterval);
        this._router.navigateByUrl('/auth/sign-in');
    }

    formatTime(seconds: number): string {
        const minutes: number = Math.floor(seconds / 60);
        const remainingSeconds: number = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // requestOtp(): void {
    //     this.isLoading = true;
    //     this._authService.resendOtp({ phone: this.phone }).subscribe({
    //         next: (response) => {
    //             this.isLoading = false;
    //             this.remainingTime = 60;
    //             this.startCountdown();
    //             this.reSendOtp = false;
    //             this._snackbarService.openSnackBar(response.message, GlobalConstants.success);
    //         },
    //         error: (err: HttpErrorResponse) => {
    //             console.log(err)
    //             const errors: { field: string, message: string }[] | undefined = err.error.errors;
    //             let message: string = err.error.message;
    //             if (errors && errors.length > 0) {
    //                 message = errors.map((obj) => obj.message).join(', ')
    //             }
    //             this._snackbarService.openSnackBar(message ?? GlobalConstants.genericError, GlobalConstants.error);
    //             this.isLoading = false;
    //         }
    //     });
    // }

    // resendOtp(): void {
    //     this.isLoading = true;
    //     this._authService.requestOtp(this.phone ).subscribe({
    //         next: (response) => {
    //             this.isLoading = false;
    //             this.remainingTime = 60;
    //             this.startCountdown();
    //             this.reSendOtp = false;
    //             this._snackbarService.openSnackBar(response.message, GlobalConstants.success);
    //         },
    //         error: (err: HttpErrorResponse) => {
    //             console.log(err)
    //             const errors: { field: string, message: string }[] | undefined = err.error.errors;
    //             let message: string = err.error.message;
    //             if (errors && errors.length > 0) {
    //                 message = errors.map((obj) => obj.message).join(', ')
    //             }
    //             this._snackbarService.openSnackBar(message ?? GlobalConstants.genericError, GlobalConstants.error);
    //             this.isLoading = false;
    //         }
    //     });
    // }

    /**
     * * im just trying to use boolean in an array to control the form transition using array index like this example "[otp, password, 2fa]" 
    */
    
    changeToPassword(): void {
        this.isOtpForm = [false, true, false];
    }

    changeToOtp(): void {
        this.isOtpForm = [true, false, false];
    }

    changeTo2fa(): void {
        this.isOtpForm = [false, false, true];
    }

    verify(): void {
        this.isLoading = true;

        if(this.otpCode === '123456'){
            this._router.navigateByUrl('');
        }
        

        // this._authService.verifyOtp({phone: this.phone, otp: this.otpCode }).subscribe({
        //     next: (_response) => {
        //         this.isLoading = false;
        //         this.clearAllInput();
                
        //         // have to update the token observable to update the state or else it wont save access token
        //         this._authService.token$.pipe(takeUntil(this._unsubscribeAll)).subscribe((_response: { token: string }) => {
        //                 this.token = _response.token;
        //             });
        //         this._authService.verified(this.token);
        //         this._snackbarService.openSnackBar("Login successful", GlobalConstants.success);
        //         this._router.navigateByUrl('');

        //     },
        //     error: (err: HttpErrorResponse) => {
        //         const errors: { field: string, message: string }[] | undefined = err.error.errors;
        //         let message: string = err.error.message;
        //         if (errors && errors.length > 0) {
        //             message = errors.map((obj) => obj.message).join(', ')
        //         }
        //         this._snackbarService.openSnackBar(message ?? GlobalConstants.genericError, GlobalConstants.error);
        //         this.isLoading = false;
        //     }
        // });
    }

    // verifypassword(): void {
    //     this.isLoading = true;
    //     this._authService.verifyPassword({ phone: this.phone, password: this.passwordForm.get('password')?.value }).subscribe({
    //         next: (_response) => {
    //             this.isLoading = false;
    //             this.clearAllInput();


    //             if(!this.temp2fa){
    //                 this._authService.token$.pipe(takeUntil(this._unsubscribeAll)).subscribe((_response: { token: string }) => {
    //                     this.token = _response.token;
    //                 });
    //                 if (!this.token) {
    //                     this._snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
    //                     this._router.navigateByUrl('/auth/sign-in');
    //                     return;
    //                 }
                    
    //                 this._authService.verified(this.token);
    //                 this._snackbarService.openSnackBar("Login successful", GlobalConstants.success);
    //                 this._router.navigateByUrl('');
    //             }else{
    //                 this.changeTo2fa();
    //             }
    //         },
    //         error: (err: HttpErrorResponse) => {
    //             const errors: { field: string, message: string }[] | undefined = err.error.errors;
    //             let message: string = err.error.message;
    //             if (errors && errors.length > 0) {
    //                 message = errors.map((obj) => obj.message).join(', ')
    //             }
    //             this._snackbarService.openSnackBar(message ?? GlobalConstants.genericError, GlobalConstants.error);
    //             this.isLoading = false;
    //         }
    //     })

    // }

    //isnt used right now
    verify2fa(): void {
        this.isLoading = true;

        if(this.otpCode === '123456'){
            this._router.navigateByUrl('');
        }
        
        // this._authService.verify2fa({ temp_2fa_token: this.temp2fa, otp: this.otpCode }).subscribe({
        //     next: (_response) => {
        //         this.isLoading = false;
        //         this.clearAllInput();
        //         this._authService.token$.pipe(takeUntil(this._unsubscribeAll)).subscribe((_response: { token: string }) => {
        //             this.token = _response.token;
        //         });
        //         if (!this.token) {
        //             this._snackbarService.openSnackBar('Unauthorized', GlobalConstants.error);
        //             return;
        //         }
                
        //         this._authService.verified(this.token);
        //         this._snackbarService.openSnackBar("Login Successful", GlobalConstants.success);
        //         this._router.navigateByUrl('');
        //     },
        //     error: (err: HttpErrorResponse) => {
        //         const errors: { field: string, message: string }[] | undefined = err.error.errors;
        //         let message: string = err.error.message;
        //         if (errors && errors.length > 0) {
        //             message = errors.map((obj) => obj.message).join(', ')
        //         }
        //         this._snackbarService.openSnackBar(message ?? GlobalConstants.genericError, GlobalConstants.error);
        //         this.isLoading = false;
        //     }
        // })

    }

    clearAllInput(){
        this.numStr1 = '';
        this.numStr2 = '';
        this.numStr3 = '';
        this.numStr4 = '';
        this.numStr5 = '';
        this.numStr6 = '';
    }

    keyDownHandler1(event: KeyboardEvent | any): void {
        if (event.key === 'Backspace') {
            this.numStr1 = '';
            this.checkValid();
            event.preventDefault();
        } else if (event.key === 'Tab') {
            event.preventDefault();
        } else {
            var keyCode = event.which || event.keyCode;

            if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
                if (this.numStr1 !== '') {
                    this.input2.nativeElement.focus();
                }
                event.preventDefault();
            } else {
                const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

                if (array.includes(event.key)) {
                    this.numStr1 = event.key;
                    if (!this.checkValid()) {
                        this.input2.nativeElement.focus();
                    } else {
                        this.input1.nativeElement.blur();
                    }
                    event.preventDefault();
                } else {
                    // Prevent input of non-English numbers (Khmer numbers)
                    event.preventDefault();
                }
            }
        }

    }

    keyDownHandler2(event: KeyboardEvent | any): void {
        if (event.key === 'Backspace') {
            if (this.numStr2 === '') {
                this.input1.nativeElement.focus();
            }
            this.numStr2 = '';
            this.checkValid();
            event.preventDefault();
        } else if (event.key === 'Tab') {
            event.preventDefault();
        } else {
            var keyCode = event.which || event.keyCode;

            if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
                if (this.numStr2 !== '') {
                    this.input3.nativeElement.focus();
                }
                event.preventDefault();
            } else {
                const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

                if (array.includes(event.key)) {
                    this.numStr2 = event.key;
                    if (!this.checkValid()) {
                        this.input3.nativeElement.focus();
                    } else {
                        this.input2.nativeElement.blur();
                    }
                    event.preventDefault();
                } else {
                    // Prevent input of non-English numbers (Khmer numbers)
                    event.preventDefault();
                }
            }
        }
    }

    keyDownHandler3(event: KeyboardEvent | any): void {
        if (this.numStr3 === '') {
            this.input2.nativeElement.focus();
        }
        if (event.key === 'Backspace') {
            this.numStr3 = '';
            this.checkValid();
            event.preventDefault();
        } else if (event.key === 'Tab') {
            event.preventDefault();
        } else {
            var keyCode = event.which || event.keyCode;

            if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
                if (this.numStr3 !== '') {
                    this.input4.nativeElement.focus();
                }
                event.preventDefault();
            } else {
                const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

                if (array.includes(event.key)) {
                    this.numStr3 = event.key;
                    if (!this.checkValid()) {
                        this.input4.nativeElement.focus();
                    } else {
                        this.input3.nativeElement.blur();
                    }
                    event.preventDefault();
                } else {
                    // Prevent input of non-English numbers (Khmer numbers)
                    event.preventDefault();
                }
            }
        }
    }

    keyDownHandler4(event: KeyboardEvent | any): void {
        if (event.key === 'Backspace') {
            if (this.numStr4 === '') {
                this.input3.nativeElement.focus();
            }
            this.numStr4 = '';
            this.checkValid();
            event.preventDefault();
        } else if (event.key === 'Tab') {
            event.preventDefault();
        } else {
            var keyCode = event.which || event.keyCode;

            if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
                if (this.numStr4 !== '') {
                    this.input5.nativeElement.focus();
                }
                event.preventDefault();
            } else {
                const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

                if (array.includes(event.key)) {
                    this.numStr4 = event.key;
                    if (!this.checkValid()) {
                        this.input5.nativeElement.focus();
                    } else {
                        this.input4.nativeElement.blur();
                    }
                    event.preventDefault();
                } else {
                    // Prevent input of non-English numbers (Khmer numbers)
                    event.preventDefault();
                }
            }
        }
    }

    keyDownHandler5(event: KeyboardEvent | any): void {
        if (event.key === 'Backspace') {
            if (this.numStr5 === '') {
                this.input4.nativeElement.focus();
            }
            this.numStr5 = '';
            this.checkValid();
            event.preventDefault();
        } else if (event.key === 'Tab') {
            event.preventDefault();
        } else {
            var keyCode = event.which || event.keyCode;

            if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
                if (this.numStr5 !== '') {
                    this.input6.nativeElement.focus();
                }
                event.preventDefault();
            } else {
                const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

                if (array.includes(event.key)) {
                    this.numStr5 = event.key;
                    if (!this.checkValid()) {
                        this.input6.nativeElement.focus();
                    } else {
                        this.input5.nativeElement.blur();
                    }
                    event.preventDefault();
                } else {
                    // Prevent input of non-English numbers (Khmer numbers)
                    event.preventDefault();
                }
            }
        }
    }

    keyDownHandler6(event: KeyboardEvent | any): void {
        if (event.key === 'Backspace') {
            if (this.numStr6 === '') {
                this.input5.nativeElement.focus();
            }
            this.numStr6 = '';
            this.checkValid();
            event.preventDefault();
        } else if (event.key === 'Tab') {
            event.preventDefault();
        } else {
            var keyCode = event.which || event.keyCode;

            if (keyCode !== 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
                event.preventDefault();
            } else {
                const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

                if (array.includes(event.key)) {
                    this.numStr6 = event.key;
                    if (this.checkValid()) {
                        this.input6.nativeElement.blur();
                    }
                    event.preventDefault();
                } else {
                    // Prevent input of non-English numbers (Khmer numbers)
                    event.preventDefault();
                }
            }
        }
    }

    // Listen for keyup event on the document
    // @HostListener('document:keyup', ['$event'])
    // handleKeyboardEvent(event: KeyboardEvent) {
    //     if (event.key === 'Enter' && this.numStr6 !== '') {
    //         if (this.checkValid()) {
    //             this.input6.nativeElement.blur();
    //             this.verify();
    //         }
    //         event.preventDefault();
    //     }
    // }

    checkValid(): boolean {
        this.otpCode = this.numStr1 + this.numStr2 + this.numStr3 + this.numStr4 + this.numStr5 + this.numStr6;
        this.canSubmit = this.otpCode.length === 6;
        return this.canSubmit;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}