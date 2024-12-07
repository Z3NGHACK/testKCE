import { Component } from '@angular/core';
import { SharedListTeacherComponent } from 'app/shared/teacher/listing/teacher.component';

@Component({
    selector: 'principal-teacher',
    standalone: true,
    imports: [
        SharedListTeacherComponent
    ],
    templateUrl: './teacher.component.html',
})
export class TeacherComponent {
}
