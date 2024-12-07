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
import { Student } from 'app/resources/principal/year/academic.type';
import { AcademicService } from '../../academic.service';


@Component({
    selector: 'view-year-application-GM',
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
export class GMApplicationComponent implements OnInit {

    @Input() id: number;
    data: Student[] = [];
    filterData: Student[] = [];

    displayedColumns: string[] = ['profile', 'sex', 'campus', 'class', 'date', 'action'];
    dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>([]);
    isLoading: boolean = false;
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    path: 'receptionist' | 'general-manager';
    fileUrl: string = env.FILE_BASE_URL;
    Level_name: string = 'ទាំងអស់';
    Levels: any[] = [];
    sortOrder= 'asc'; 

    isReversed: boolean = false;
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
    
    listing(_limit: number = 15, _page: number = 1): void {
        
        const param: { limit: number, page: number, key?: string, levelid: number } = {
            limit: _limit,
            page: _page,
            levelid: this.id // Assuming this.id is always present
        };
    
        if (this.key !== '') {
            param.key = this.key;
        }
    
        if (this.page !== 0) {
            param.page = this.page;
        }
        
        this.isLoading = true;
        this._academicService.listingStudent(this.id, param).subscribe({
            next: res => {
                this.data = res.data;
                this.filterData = this.data;
                
                this.total = res.pagination.total_items;
                this.page = res.pagination.current_page;
                this.limit = res.pagination.per_page;
                this.dataSource.data = this.data;
                this.isLoading = false;

                this.Levels = [...new Set(this.data.map(item => item.level))];

                console.log(this.dataSource.data)
                this.Level_name= 'ទាំងអស់'
                
            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }


    sorting(): void {
        this.data.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
    
            if (this.sortOrder === 'asc') {
                this.sortOrder = 'dec'
                return nameA.localeCompare(nameB);

            } else {    
                this.sortOrder = 'asc'           
                return nameB.localeCompare(nameA);
                
            }
        });
        this.dataSource.data = this.data;
    }

    sortByLevel(): void {
        if (this.Level_name === 'ទាំងអស់') {
            // Show all data if 'ទាំងអស់' is selected
            this.filterData = [...this.data];
        } else {
            // Filter data based on the selected branch
            this.filterData = this.data.filter(item => item.level === this.Level_name);
        }
        this.dataSource.data = this.filterData;
    }


    SelectorSort(): void{
        if (this.isReversed) {
            // Sort in normal order
            this.Levels = [...new Set(this.data.map(item => item.level))].sort((a, b) => Number(a) - Number(b));
            // Sort in reverse order
            this.Levels = [...new Set(this.data.map(item => item.level))].sort((a, b) => Number(b) - Number(a));
          }
        
        this.isReversed = !this.isReversed;
    }


    onPageChanged(event: PageEvent) {
        if (event && event.pageSize) {
            this.limit = event.pageSize;
            this.page = event.pageIndex + 1;
            this.listing();
        }
    }
    
    // viewDetail(): void {
    //     const dialogConfig = new MatDialogConfig();
    //     // dialogConfig.data =  row;
    //     dialogConfig.position = { right: '0', top: '0' };
    //     dialogConfig.height = '100vh';
    //     dialogConfig.panelClass = 'side-dialog';
    //     dialogConfig.autoFocus = false;
    
    //     const dialogRef = this._matDialog.open(ViewApplicationComponent, dialogConfig);
    
    //     // dialogRef.afterClosed().subscribe(() => {
    //     //   this.listing();
    //     // });
    //   }
}
