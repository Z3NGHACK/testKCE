import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { roleResolver } from './core/auth/resolvers/role.resolver';
import { RoleEnum } from '../helper/enums/role.enum';
import { initialDataResolver } from './app.resolver';

export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboard'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: 'auth',
        canActivate: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        loadChildren: () => import('app/resources/account/auth/auth.routes')
    },

   

    // For test component
    {
        path: 'test',
        loadChildren: () => import('app/test/test.routes')
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [

            // Role general manager
            {
                path: '',
                resolve: {
                    role: roleResolver([RoleEnum.MANAGER])
                },
                loadChildren: () => import('app/resources/general-manager/general-manager.routes')
            },

            // Role principal
            {
                path: 'principal',
                resolve: {
                    role: roleResolver([RoleEnum.PRINCIPAL])
                },
                loadChildren: () => import('app/resources/principal/principal.routes')
            },

            // Role accountant
            {
                path: 'accountant',
                resolve: {
                    role: roleResolver([RoleEnum.ACCOUNTANT])
                },
                loadChildren: () => import('app/resources/accountant/accountant.routes')
            },

            // Role receptionist
            {
                path: 'receptionist',
                resolve: {
                    role: roleResolver([RoleEnum.RECEPTIONIST])
                },
                loadChildren: () => import('app/resources/receptionist/receptionist.routes')
            },

            // Role teacher
            {
                path: 'teacher',
                resolve: {
                    role: roleResolver([RoleEnum.TEACHER])
                },
                loadChildren: () => import('app/resources/teacher/teacher.routes')
            },

            // Role parent
            {
                path: 'parent',
                resolve: {
                    role: roleResolver([RoleEnum.PARENT])
                },
                loadChildren: () => import('app/resources/parent/parent.routes')
            },


             //for account view route
            {
                path: 'account',
                resolve: {
                    initialData: initialDataResolver
                },
                loadChildren: () => import('app/resources/account/profile/profile.routes')
            },

            // 404
            {
                path: '404-not-found',
                pathMatch: 'full',
                loadChildren: () => import('app/shared/error/not-found.routes')
            },
            // Catch all
            {
                path: '**',
                redirectTo: '404-not-found'
            }
        ]
    }

];
