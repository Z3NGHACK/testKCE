import { Component, Input, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { General } from 'app/resources/principal/class/classroom.type';

@Component({
    selector: 'Shared-class-room-general',
    standalone: true,
    imports: [
        MatIconModule,
    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss'
})
export class SharedClassRoomGeneralComponent {
    @Input() id: number;
    @Input() path: 'principal' | 'general-manager';
    public data: General;

    constructor(

        private _snackbarService: SnackbarService,
        private _teacherService: SharedTeacherService,
      ) {
    
      }
    ngOnInit(): void {
        this.view();    
    }

    view(): void {
        this._teacherService.viewClassroom(this.path , this.id).subscribe({
        next: res => {
            this.data = res.general;
            console.log(res);
        },
        error: err => {
            this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        }
        
        });
    }

}


