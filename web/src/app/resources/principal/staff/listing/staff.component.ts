import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
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
import { StaffService } from '../staff.service';
import { Staff } from '../staff.type';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrincipalStaffCreateComponent } from '../create/create.component';

@Component({
    selector: 'principal-staff',
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
        CapitalizePipe,
        MatInputModule,
        

    ],
    templateUrl: './staff.component.html',
    styleUrl: './staff.component.scss',
    animations: helperAnimations
})
export class StaffComponent {
    path: 'principal' | 'general-manager';
    fileUrl: string = env.FILE_BASE_URL;

    public isSearching: boolean = false;
    public data: Staff[] = [];
    displayedColumns: string[] = ['profile', 'role', 'date', 'action'];
    dataSource: MatTableDataSource<Staff> = new MatTableDataSource<Staff>([]);
    public key: string = '';
    public page: number = 1;
    public limit: number = 15;
    public total: number = 0;
    public isLoading = true;

    
    role: number = null;
    roles: any[] = [];

    constructor(
        private _staffService: StaffService,
        private _snackbarService: SnackbarService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _matDialog: MatDialog,
    ) {
        this.path = this._activatedRoute['dataSubject'].value.from;        
    }

   
    ngOnInit(): void {
        this.listing();
        this.getSetup();
    }

    view(item: Staff): void {
       this._router.navigateByUrl(`/principal/staff/view/${item.id}`)
    }

    listing(_limit: number = 15, _page: number = 1): void {
        const param: { limit: number, page: number, key?: string , roleid?: number } = {
            limit: _limit,
            page: _page,
        };
        if (this.key != '') {
            param.key = this.key;
        }
        if (this.role != 0) {
            param.roleid = this.role;
        }
        if (this.page != 0) {
            param.page = this.page;
        }

        this.isLoading = true;
        this._staffService.listing(param).subscribe({
            next: res => {
                this.data = res.data;
                this.total = res.pagination.total_items;
                this.page = res.pagination.current_page;
                this.limit = res.pagination.per_page;
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

    getSetup(){
        this._staffService.getSetup().subscribe({
            next: res => {
                this.roles= res.data;
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
    
    create(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(PrincipalStaffCreateComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            this.listing(this.limit, this.page);
        });
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
