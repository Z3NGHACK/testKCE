import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ClassroomDetailComponent } from 'app/shared/dialog/student-classroom-detail/student-classroom-detail.component';
import { time } from 'console';
import { helperAnimations } from 'helper/animations';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { Subject } from 'rxjs';
import { ClassroomService } from '../../class.service';
import { ClassroomShift } from '../../classroom.type';
import { GlobalConstants } from 'helper/shared/constants';
import { PrincipleShiftDetailComponent } from './subject-detail/subject-detail.component';

@Component({
    selector: 'principle-class-room-teaching',
    standalone: true,
    imports: [
        MatIconModule,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    templateUrl: './teaching.component.html',
    styleUrl: './teaching.component.scss'
})
export class PrincipleTeachingComponent {


    @Input() id:number
    @Input() general:any;


    displayedColumns: string[] = ['time', 'subject', 'class' ,   'action'];
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    public isLoading = false;
    public data: ClassroomShift[];
    dataSource: MatTableDataSource<ClassroomShift> = new MatTableDataSource<ClassroomShift>([])
    
    ngOnInit(): void {
        this.listing();
    }

    constructor(
        private _matDialog : MatDialog,
        private _snackbarService: SnackbarService,
        private _classroomService: ClassroomService,
    ) {
        
    }   

    listing(_limit: number = 15, _page: number = 1): void {
        const param: { limit: number, page: number, key?: string } = {
            limit: _limit,
            page: _page
        };
        if (this.key != '') {
            param.key = this.key;
        }
        if (this.page != 0) {
            param.page = this.page;
        }
        this.isLoading = true;
        this._classroomService.view(this.id).subscribe({
            next: res => {
                this.data = res.classroom_shifts;
                this.dataSource.data = this.data;
                this.isLoading = false;
                console.log(this.data)
            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }


    getStatusSituation(status: string): string {
        switch (status) {
            case 'នៅរៀន':
                return 'text-green-500';
            default:
                return 'text-red-500';
        }
    }

    viewDetail(data): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data =  {path : 'teacher' , data: data , general: this.general};
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(PrincipleShiftDetailComponent, dialogConfig);
    
        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }

      
}
