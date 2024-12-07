import { Component, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GlobalConstants } from 'helper/shared/constants';
import { BranchService } from '../../branch.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Staff, Teacher, TeacherData } from '../../branch.type';
import { env } from 'envs/env';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewDialogDetailComponent } from '../dialog-detail/dialog-detail.component';

@Component({
    selector: 'branch-teacher-staff',
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatTableModule,
        CommonModule,
        MatTableModule,
        ReactiveFormsModule
    ],
    templateUrl: './teacher-staff.component.html',
    styleUrl: './teacher-staff.component.scss'
})
export class BranchTeacherStaffComponent {
    @Input() id! :number;
    path: 'principal' | 'general-manager';
    fileUrl: string = env.FILE_BASE_URL;

    public isSearching: boolean = false;
    public data: TeacherData;
    displayedColumns: string[] = ['profile', 'level',  'class', 'date', 'action'];
    displayedStaffColumns: string[] = ['profile', 'roles', 'date', 'action'];
    dataSource: MatTableDataSource<Teacher> = new MatTableDataSource<Teacher>([]);
    dataStaffSource: MatTableDataSource<Staff> = new MatTableDataSource<Staff>([]);
    public key: string = '';
    public page: number = 1;
    public limit: number = 15;
    public total: number = 0;
    public isLoading = true;


    public teachers: Teacher[]=[];
    public staff: Staff[]=[];

    constructor(
        private _teacherService: BranchService,
        private _snackbarService: SnackbarService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _matDialog: MatDialog
    ) {   
        
    }

    ngOnInit(): void {
        this.listing();
        
    }

    viewTeacher(item: Teacher): void {
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {data: item , id: item.id , path: 'teacher' }
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        this._matDialog.open(ViewDialogDetailComponent, dialogConfig);

    }


    viewStaff(item: Teacher): void {
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {data: item , id: item.id , path: 'staff' }
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        this._matDialog.open(ViewDialogDetailComponent, dialogConfig);

    }

    listing(_limit: number = 10, _page: number = 1): void {
        const param: { month?: string , income_month?: string ,primary_income_month?: string } = {};

        // if (this.firstFormGroup.get('month').value != '') {
        //     param.month = this.firstFormGroup.get('month').value;
        // }

        // if (this.firstFormGroup.get('primary_income_month').value != '') {
        //     param.primary_income_month = this.firstFormGroup.get('primary_income_month').value;
        // }

        // if (this.firstFormGroup.get('income_month').value != '') {
        //     param.income_month = this.firstFormGroup.get('income_month').value;
        // }

        this.isLoading = true;
        this._teacherService.view(this.id , param).subscribe({
            next: res => {
                this.data = res.teacher;
                this.teachers = this.data.teacher;
                this.dataSource.data = this.teachers;
                
                this.staff = this.data.staff;
                this.dataStaffSource.data = this.staff;
                console.log(res)


            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }


    formatDate(dateString: string): string {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    
    onPageChanged(event: any) {
      // Handle page change event
      console.log('Page change event:', event);
      this.page = event.pageIndex + 1;
      this.limit = event.pageSize;
    }

    update(element: any) {
        console.log('Update:', element);
    }

    delete(element: any) {
        console.log('Delete:', element);
    }
}
