import { Component } from '@angular/core';
import { SharedViewStudentComponent } from 'app/shared/student/view/view.component';

@Component({
    selector: 'receptionist-view-student',
    standalone: true,
    imports: [SharedViewStudentComponent],
    templateUrl: './view.component.html'
})
export class ViewStudentComponent {

}
