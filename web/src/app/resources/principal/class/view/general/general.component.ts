import { Component, Input, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { ClassroomService } from '../../class.service';
import { General } from '../../classroom.type';
import { GlobalConstants } from 'helper/shared/constants';

@Component({
    selector: 'principle-class-room-general',
    standalone: true,
    imports: [
        MatIconModule,
    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss'
})
export class PrincipleClassRoomGeneralComponent {
    @Input() id: number;

    public data: General;

    constructor(

        private _snackbarService: SnackbarService,
        private _classroomService: ClassroomService,
      ) {
    
      }
    ngOnInit(): void {
        this.view();    
    }

    view(): void {
        this._classroomService.view(this.id).subscribe({
        next: res => {
            this.data = res.general; 
        },
        error: err => {
            this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        }
        
        });
    }

}


