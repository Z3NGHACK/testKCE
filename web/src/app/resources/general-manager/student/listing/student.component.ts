import { Component } from '@angular/core';
import { SharedListStudentComponent } from 'app/shared/student/listing/student.component';

@Component({
    selector: 'manager-list-student',
    standalone: true,
    imports: [SharedListStudentComponent],
    templateUrl: './student.component.html'
})
export class ListStudentComponent {

}
