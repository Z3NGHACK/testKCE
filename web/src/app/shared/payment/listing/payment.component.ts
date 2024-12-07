import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { env } from 'envs/env';

import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { helperAnimations } from 'helper/animations';
import { Invoice } from '../payment.type';
import { SharedPaymentService } from '../payment.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SharedViewPaymentComponent } from '../view/view.component';




@Component({
    selector: 'shared-payment',
    standalone: true,
    imports: [
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatButtonModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterLink,
        MatTooltipModule,
    
    ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss',
    animations: helperAnimations
})
export class SharedPaymentComponent {

    data: Invoice[] = [];
    displayedColumns: string[] = ['N.0', 'total_price', 'receiver_name', 'date','status' ,  'action'];
    GMdisplayedColumns: string[] = ['N.0', 'total_price', 'branch', 'receiver_name', 'date','status' ,  'action'];
    dataSource: MatTableDataSource<Invoice> = new MatTableDataSource<Invoice>([]);
    isLoading: boolean = false;
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    path: 'principal' | 'general-manager' | 'accountant' ;
    sortOrder = 'បានទូទាត់'
    statusid: number = 0;

    status: number = null;
    statuses: any[] = [];

    constructor(
        private _paymentService: SharedPaymentService ,
        private _activatedRoute: ActivatedRoute,
        private _snackbarService: SnackbarService,
        private _router: Router,
        private _matDialog: MatDialog
    ) {
        this.path = this._activatedRoute['dataSubject'].value.from;
    }

    ngOnInit(): void {
        this.listing(this.limit, this.page);
        this.getSetup();
    }

    getSetup(){
        this._paymentService.getSetup(this.path).subscribe({
            next: res => {
                this.statuses= res.data;
            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }
    
    listing(_limit: number = 15, _page: number = 1): void {
        const param: { limit: number, page: number, key?: string , statusid?: number } = {
            limit: _limit,
            page: _page,
        };
        if (this.key != '') {
            param.key = this.key;
        }

        if(this.status != 0){
            param.statusid = this.status
        }
        
        if (this.page != 0) {
            param.page = this.page;
        }
        this.isLoading = true;
        this._paymentService.listing(this.path , param).subscribe({
            next: res => {
                this.data = res.data;
                this.total = res.pagination.total_items;
                this.page = res.pagination.current_page;
                this.limit = res.pagination.per_page;
                this.dataSource.data = this.data;
                this.isLoading = false;

            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }  

    sortByStatus(){
        
        this.listing();
    }

    getStatusClass(status: string): string {
        switch (status) {
          case 'រង់ចាំ':
            return 'text-yellow-500';
          case 'បានទូទាត់':
            return 'text-green-500';
          default:
            return 'text-gray-500';
        }
      }

    onPageChanged(event: PageEvent) {
        if (event && event.pageSize) {
            this.limit = event.pageSize;
            this.page = event.pageIndex + 1;
            this.listing(this.limit, this.page);
        }
    }
    
    sorting(): void {
        if (this.statusid === 1) {
            this.statusid = 2;
            this.listing();
         

        }else if(this.statusid === 0){

            this.statusid = 1;
            this.listing();

        } else {    

            this.statusid = 1;
            this.listing();
             
        }
      
    }

    viewPayment(row: Invoice): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {row, path: this.path}// Pass current form group data
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(SharedViewPaymentComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe((result) => {  
            if(result){
                this.listing()
            }
        });
      }
    
}
