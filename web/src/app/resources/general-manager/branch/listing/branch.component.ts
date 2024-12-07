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

import { BranchService } from '../branch.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { helperAnimations } from 'helper/animations';
import { Branch, Listing } from '../branch.type';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateBranchComponent } from '../create/create.component';

@Component({
    selector: 'general-manager-branch',
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
    templateUrl: './branch.component.html',
    styleUrl: './branch.component.scss',
    animations: helperAnimations
})
export class BranchComponent {

    public isSearching: boolean = false;
    public data: any[] = [];
    displayedColumns: string[] = ['name','code', 'status','teacher', 'student', 'action'];
    dataSource: MatTableDataSource<Branch> = new MatTableDataSource<Branch>([]);
    public key: string;
    public page: number = 1;
    public limit: number = 15;
    public total: number = 0;
    fileUrl: string = env.FILE_BASE_URL;

    constructor(
        private _snackbarService: SnackbarService,
        private _service: BranchService,
        private _matDialog: MatDialog,
        private _router: Router,
    ) {
    }
    ngOnInit(): void {
        this.listing(this.limit, this.page);
    }
    
    view(item: Branch): void {
        this._router.navigateByUrl(`branch/view/${item.id}`)
    }

    listing(_limit: number = 15, _page: number = 1, _key: string = ''):void {
        const param: any = {
          limit: _limit,
          page: _page,
          };
    
          if (this.key != '') {
              param.key = this.key;
          }
          if (this.page != 0) {
              param.page = this.page;
          }
          this.isSearching = true;
         this._service.listing(param).subscribe({
            next: res => {
                this.data = res?.data;
                this.total = res?.pagination.total_items;
                this.page = res?.pagination.current_page;
                this.limit = res?.pagination.per_page;
                this.dataSource.data = this.data;
                // this.isLoading = false;
            },
            error: err => {
                // this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    onPageChanged(event: any) {
        // Handle page change event
        console.log('Page change event:', event);
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'កំពុងដំណើការ':
                return 'text-green-500';
            case 'រៀបចំ':
                return 'text-yellow-500';
            case 'ផ្អាក':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    }

    create(){
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(CreateBranchComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(() => {
            this.listing();
        });

    }


    deleteBranch(branch: Branch): void {
            this._service.deleteBranch(branch.id).subscribe({
                next: res => {
                  this._snackbarService.openSnackBar("ការលុបបានជោគជ័យ", GlobalConstants.success);
                  this.listing();
                },
                error: err => {
                  this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
                }
            });
    }
}
