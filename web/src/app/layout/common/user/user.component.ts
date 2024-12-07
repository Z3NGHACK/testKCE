import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { env } from 'envs/env';
import { AuthService } from 'app/core/auth/auth.service';
import { SwitchRoleComponent } from './switch-role/switch-role.component';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    standalone: true,
    imports: [
        MatButtonModule,
        CommonModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        SwitchRoleComponent
    ],
})
export class UserComponent implements OnInit, OnDestroy {

    user: User;
    fileUrl = env.FILE_BASE_URL;
    staticImg: string = 'assets/images/logo/avatar.png';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _authService: AuthService,
        private _userService: UserService,
        private _router: Router
    ) { }

    ngOnInit(): void {
        // Subscribe to user changes
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
            this.user = user;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    classList: string = '';
    @ViewChild('switchRoleComponent') switchRoleComponent: SwitchRoleComponent;
    handleSwitchRole(): void {
        this.classList = 'w-screen sm:max-w-120';
        this.switchRoleComponent.open();
    }

    signOut(): void {
        this._authService.signOut();
        this._router.navigateByUrl('/auth/sign-in');
    }

    viewProfile(){
        console.log('this working')
        this._router.navigateByUrl('/account/profile');
    }

}
