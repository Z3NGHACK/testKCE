import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { RoleEnum } from "helper/enums/role.enum";
import { UserPayload } from 'helper/interfaces/payload.interface';
import { AuthService } from "../auth.service";
import { of } from "rxjs";
import jwt_decode from 'jwt-decode';

export const roleResolver = (allowedRoles: string[]) => {
    return () => {
        const router = inject(Router);
        const token = inject(AuthService).accessToken;
        const tokenPayload: UserPayload = jwt_decode(token);
        const role = tokenPayload.user.roles.find(role => role.is_default);
        const isValidRole = allowedRoles.includes(role.name);
        // If the user's role is not valid
        if (!isValidRole) {
            switch (role.name) {
                case RoleEnum.PRINCIPAL:    router.navigateByUrl('/principal/dashboard'); break;
                case RoleEnum.ACCOUNTANT:   router.navigateByUrl('/accountant/dashboard'); break;
                case RoleEnum.RECEPTIONIST: router.navigateByUrl('/receptionist/dashboard'); break;
                case RoleEnum.TEACHER:      router.navigateByUrl('/teacher/dashboard'); break;
                case RoleEnum.PARENT:       router.navigateByUrl('/parent/dashboard'); break;
                default:                    router.navigateByUrl('/'); break; //is Manager
            }
            // Show unauthorized access message
            return of(false);
        }
        // Allow access
        return of(allowedRoles);
    };
};
