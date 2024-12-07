import { Component } from '@angular/core';
import { SharedViewTeacherComponent } from 'app/shared/teacher/view/view.component';

@Component({
    selector: 'general-manager-view-teacher',
    standalone: true,
    imports: [ SharedViewTeacherComponent  ],
    templateUrl: './view.component.html',
})
export class TeacherViewComponent {
}
