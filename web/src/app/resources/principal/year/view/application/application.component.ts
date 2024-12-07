import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { env } from 'envs/env';
import { SharedStudentService } from 'app/shared/student/student.service';
import { Item } from 'app/shared/student/student.types';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { helperAnimations } from 'helper/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewApplicationComponent } from './view/view.component';
import { Student } from '../../academic.type';
import { AcademicService } from '../../academic.service';


@Component({
    selector: 'view-year-application-principal',
    standalone: true,
    imports: [
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        CommonModule,
        RouterLink,
        MatTooltipModule,
        MatSelectModule,
       
    ],
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.scss'],
    animations: helperAnimations
})
export class ApplicationPrincipleComponent implements OnInit {

    @Input() id: number;
    data: Student[] = [];
    displayedColumns: string[] = ['profile', 'sex', 'campus', 'class', 'date', 'action'];
    dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>([]);
    isLoading: boolean = false;
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    path: 'receptionist' | 'general-manager';
    fileUrl: string = env.FILE_BASE_URL;
    branch_id: number = 0;
    branches: { id: number, name: string }[] = [];

    constructor(
        private _academicService: AcademicService,
        private _activatedRoute: ActivatedRoute,
        private _snackbarService: SnackbarService,
        private _router: Router,
        private _matDialog: MatDialog,
    ) {
        this.path = this._activatedRoute['dataSubject'].value.from;
    }

    ngOnInit(): void {
        this.listing();
        // this.viewDetail();
    }

    view(item: Item): void {
        this.path === 'receptionist' ? this._router.navigateByUrl(`${this.path}/students/view/${item.id}`) : this._router.navigateByUrl(`/student/view/${item.id}`)
    }
    
    listing(): void {
        this._academicService.view(this.id).subscribe({
            next: res => {
                this.data = res.students.studentList;
                this.dataSource.data = this.data;
                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    onPageChanged(event: PageEvent) {
        if (event && event.pageSize) {
            this.limit = event.pageSize;
            this.page = event.pageIndex + 1;
            this.listing();
        }
    }

    viewDetail(): void {
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(ViewApplicationComponent, dialogConfig);
    
        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }
}
