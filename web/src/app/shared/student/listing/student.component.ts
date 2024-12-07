import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { env } from 'envs/env';
import { SharedStudentService } from '../student.service';
import { Item } from '../student.types';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { helperAnimations } from 'helper/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FilterStudentComponent } from './filter/filter.component';


@Component({
    selector: 'shared-listing-student',
    standalone: true,
    imports: [
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatButtonModule,
        CommonModule,
        RouterLink,
        MatTooltipModule
    ],
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss'],
    animations: helperAnimations
})
export class SharedListStudentComponent implements OnInit {

    data: Item[] = [];
    filterData: Item[] = [];
    displayedColumns: string[] = ['profile', 'sex', 'class', 'date', 'action'];
    dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>([]);
    isLoading: boolean = false;
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    path: 'receptionist' | 'general-manager';
    fileUrl: string = env.FILE_BASE_URL;
    branch_name: string = 'ទាំងអស់';
    branches: any[] = [];
    sortOrder = 'asc';
    level_id: number;
    grade_id: number;
    sex_id: number;


    constructor(
        private _studentService: SharedStudentService,
        private _activatedRoute: ActivatedRoute,
        private _snackbarService: SnackbarService,
        private _router: Router,
        private matDialog: MatDialog
    ) {
        this.path = this._activatedRoute['dataSubject'].value.from;
    }

    ngOnInit(): void {
        this.listing(this.limit, this.page);
    }

    view(item: Item): void {
        this.path === 'receptionist' ? this._router.navigateByUrl(`${this.path}/students/view/${item.id}`) : this._router.navigateByUrl(`/student/view/${item.id}`)
    }

    listing(_limit: number = 15, _page: number = 1): void {
        const param: { limit: number, page: number, key?: string,sex_id?: number,level_id?: number,grade_id?: number } = {
            limit: _limit,
            page: _page
        };
        if (this.key != '') {
            param.key = this.key;
        }
        if (this.sex_id) {
            param.sex_id = this.sex_id;
        }
        if (this.level_id) {
            param.level_id = this.level_id;
        }
        if (this.grade_id) {
            param.grade_id = this.grade_id;
        }
        if (this.page != 0) {
            param.page = this.page;
        }
        this.isLoading = true;
        this._studentService.listing(this.path, param).subscribe({
            next: res => {
                this.data = res.data;
                this.filterData = this.data;
                this.total = res.pagination.total_items;
                this.page = res.pagination.current_page;
                this.limit = res.pagination.per_page;
                this.dataSource.data = this.data;
                this.isLoading = false;
                this.branch_name = 'ទាំងអស់';
                this.branches = [...new Set(this.data.map(item => item.branch))];
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

    sortByBranch(): void {

        if (this.branch_name === 'ទាំងអស់') {
            // If 'ទាំងអស់' is selected, sort by branch in ascending order
            this.filterData = [...this.data].sort((a, b) => a.branch.localeCompare(b.branch));
        } else {
            // Sort the data within the selected branch group
            this.filterData = this.data
                .filter(item => item.branch === this.branch_name)
                .sort((a, b) => a.name.localeCompare(b.name));  // Sort by name within the branch
        }
        
        this.dataSource.data = this.filterData;
        this.total = this.filterData.length
    }

    filter() {
        try{
            this._studentService.setupFilter().subscribe((res:any)=>{
                const dialogConfig = new MatDialogConfig();
                dialogConfig.data = {
                    param:{ level_id: this.level_id, sex_id: this.sex_id, grade_id: this.grade_id },
                    setup:res.data
                };
                dialogConfig.position = { right: '0', top: '0' };
                dialogConfig.height = '100vh';
                dialogConfig.panelClass = 'side-dialog';
                dialogConfig.autoFocus = false;

                const dialogRef = this.matDialog.open(FilterStudentComponent, dialogConfig);
                dialogRef.afterClosed().subscribe((res: any) => {
                    this.sex_id=res.sex_id,
                    this.level_id=res.level_id,
                    this.grade_id=res.grade_id,
                    this.listing();
                });
            })
        }catch(err){
            console.log(err);
        }
    }
    onPageChanged(event: PageEvent) {
        if (event && event.pageSize) {
            this.limit = event.pageSize;
            this.page = event.pageIndex + 1;
            this.listing(this.limit, this.page);
        }
    }
}
