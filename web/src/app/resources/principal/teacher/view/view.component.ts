import { Component } from '@angular/core';
import { SharedViewTeacherComponent } from 'app/shared/teacher/view/view.component';


@Component({
    selector: 'principal-teacher-view',
    standalone: true,
    imports: [
        SharedViewTeacherComponent
    ],
    templateUrl: './view.component.html',
})
export class ViewTeacherPrincipleComponent {
}
