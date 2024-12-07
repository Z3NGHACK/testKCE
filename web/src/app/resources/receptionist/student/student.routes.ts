import { Routes } from "@angular/router";
import { CreateComponent } from "./create/create.component";
import { roleResolver } from "app/core/auth/resolvers/role.resolver";
import { ListStudentComponent } from "./listing/student.component";
import { RoleEnum } from "helper/enums/role.enum";

export default [
    {
        path: '',
        resolve: {
            role: roleResolver([RoleEnum.RECEPTIONIST])
        },
        children: [
            {
                path: 'listing',
                component: ListStudentComponent
            },
            {
                path: 'create',
                component: CreateComponent
            },
        ]
    }
] as Routes;
