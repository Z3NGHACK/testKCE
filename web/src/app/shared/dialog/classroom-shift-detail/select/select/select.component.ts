import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
    selector: 'shared-select',
    standalone: true,
    imports: [
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonToggleModule,
        MatMenuModule,
        MatButtonModule,
        CommonModule,

    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss'
})
export class selectComponent {
    @Input() value:any;
    @Input() row:any;
    @Output() change =new EventEmitter();
    id:number;
    ngOnInit(){
        this.id=this.value;
    }
    onChange(){
        this.row.status.id=this.id;
        this.row.status.name=this.id == 1 ? 'វត្តមាន': this.id == 2 ? 'អវត្តមាន':'ច្បាប់';
        this.change.emit(this.row);
    }
}
