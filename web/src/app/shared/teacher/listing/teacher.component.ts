import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { SharedTeacherService } from '../teacher.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCommonModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { helperAnimations } from 'helper/animations';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { capitalize } from 'lodash';
import { CapitalizePipe } from 'helper/pipes/capitalize.pipe';
import { Teacher } from '../teacher.types';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SearchTeacherDialogComponent } from '../search/search.component';
import { number } from 'echarts';

@Component({
    selector: 'shared-listing-teacher',
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
        MatTooltipModule,
        CapitalizePipe
    ],
    templateUrl: './teacher.component.html',
    styleUrl: './teacher.component.scss',
    animations: helperAnimations
})
export class SharedListTeacherComponent {
    path: 'principal' | 'general-manager';
    fileUrl: string = env.FILE_BASE_URL;

    public isSearching: boolean = false;
    public data: Teacher[] = [];
    filterData: Teacher[] = [];
    GMdisplayedColumns: string[] = ['profile', 'branch', 'level',  'class', 'date', 'action'];
    displayedColumns: string[] = ['profile', 'level',  'class', 'date', 'action'];
    dataSource: MatTableDataSource<Teacher> = new MatTableDataSource<Teacher>([]);
    public key: string = '';
    public page: number = 1;
    public limit: number = 15;
    public total: number = 0;
    public isLoading = true;
    branch_name: string = 'ទាំងអស់';
    branches: any[] = [];

    search_branch: number= 0;
    search_level: number= 0;


    levelid: number = 0;
    levels: any[] = [];

    constructor(
        private _teacherService: SharedTeacherService,
        private _snackbarService: SnackbarService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _matDialog: MatDialog,
    ) {
        this.path = this._activatedRoute['dataSubject'].value.from;        
    }

   
    ngOnInit(): void {
        this.listing();
        if(this.path === 'principal'){
            this.getSetup();
        }
    }

    view(item: Teacher): void {
        this.path === 'principal' ? this._router.navigateByUrl(`${this.path}/teacher/view/${item.id}`) : this._router.navigateByUrl(`/teacher/view/${item.id}`)
    }

    listing(_limit: number = 10, _page: number = 1): void {
        const param: { limit: number, page: number, key?: string , branchId?: number , levelId?: number ,  levelid?: number } = {
            limit: _limit,
            page: _page
        };
        if (this.key != '') {
            param.key = this.key;
        }
        if (this.page != 0) {
            param.page = this.page;
        }
        if (this.search_branch != 0) {
            param.branchId= this.search_branch;
        }
        if (this.search_level != 0) {
            param.levelId= this.search_level;
        }
        if (this.levelid != 0) {
            param.levelid= this.levelid;
        }

        this.isLoading = true;
        this._teacherService.listing(this.path, param).subscribe({
            next: res => {
                this.data = res.data;
                this.total = res.pagination.total_items;
                this.page = res.pagination.current_page;
                this.limit = res.pagination.per_page;
                this.dataSource.data = this.data;
                this.isLoading = false;

                this.branch_name = 'ទាំងអស់';
                this.branches = [...new Set(this.data.map(item => item.branch_name))];
            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    getSetup(): void {  
        this._teacherService.getSetupLevel(this.path).subscribe({
            next: res => {
                setTimeout(() => {
                    this.levels = res.data;
                });
            },
            error: err => {
             
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });

     
    }

    sortByBranch(): void {

        if (this.branch_name === 'ទាំងអស់') {
            // If 'ទាំងអស់' is selected, sort by branch in ascending order
            this.filterData = [...this.data].sort((a, b) => a.branch_name.localeCompare(b.branch_name));
            
        } else {
            // Sort the data within the selected branch group
            this.filterData = this.data
                .filter(item => item.branch_name === this.branch_name)
                .sort((a, b) => a.name.localeCompare(b.name));  // Sort by name within the branch
        }
        this.dataSource.data = this.filterData;
        this.total = this.filterData.length
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

    search(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.data = this.path;
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(SearchTeacherDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
            if(result){
                this.search_branch = result.branchId;
                this.search_level = result.levelId;
                this.listing();  

                console.log(this.search_branch)
                console.log(this.search_level)
            }   
        });
    }

}
