import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'teacher-class-room-general',
    standalone: true,
    imports: [
        MatIconModule,
    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss'
})
export class ClassRoomGeneralComponent {
    @Input() data:any;
    ngOnInit():void{
        console.log(this.data)
    }
}


