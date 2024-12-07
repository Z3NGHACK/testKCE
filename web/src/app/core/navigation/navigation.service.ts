import { Injectable } from '@angular/core';
import { HelperNavigationItem } from 'helper/components/navigation';
import { Observable, ReplaySubject } from 'rxjs';
import { Role } from '../user/user.types';
import { RoleEnum } from 'helper/enums/role.enum';
import { navigationData } from './navigation.data';

@Injectable({ providedIn: 'root' })
export class NavigationService {

    private _navigation: ReplaySubject<HelperNavigationItem[]> = new ReplaySubject<HelperNavigationItem[]>(1);

    set navigations(role: Role) {
        switch (role.name) {
            case RoleEnum.MANAGER: this._navigation.next(navigationData.manager); break;
            case RoleEnum.PRINCIPAL: this._navigation.next(navigationData.principal); break;
            case RoleEnum.ACCOUNTANT: this._navigation.next(navigationData.accountant); break;
            case RoleEnum.RECEPTIONIST: this._navigation.next(navigationData.receptionist); break;
            case RoleEnum.TEACHER: this._navigation.next(navigationData.teacher); break;
            case RoleEnum.PARENT: this._navigation.next(navigationData.parent); break;
            default: this._navigation.next([]); break;
        }
    }

    get navigations$(): Observable<HelperNavigationItem[]> {
        return this._navigation.asObservable();
    }
}
