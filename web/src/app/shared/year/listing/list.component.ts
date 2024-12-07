import { Component } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KhmerDatePipe } from 'helper/pipes/khmer-date.pipe';
import { CapitalizePipe } from 'helper/pipes/capitalize.pipe';
import { AcademicService } from '../academic.service';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SharedAcademicService } from '../year.service';
// import { YearCreateComponent } from '../create/create.component';


@Component({
    selector: 'general-manager-year',
    standalone: true,
    imports: [
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatButtonModule,
        CommonModule,
        RouterLink,
        MatTooltipModule,
        KhmerDatePipe,
        CapitalizePipe,
    ],
    templateUrl: './year.component.html',
    styleUrl: './year.component.scss'
})
export class YearComponent {
    public isSearching: boolean = false;
    public data: any[] = [];
    displayedColumns: string[] = ['year', 'status','class', 'student', 'action'];
    public dataSource: MatTableDataSource<any>;
    public key: string;
    public page: number = 1;
    public limit: number = 15;
    public total: number = 0;
    fileUrl: string = env.FILE_BASE_URL;

    constructor(
        private _service: SharedAcademicService,
        private _snackbarService: SnackbarService,
        private _router: Router,
        private _matDialog: MatDialog
    ) {
        this.dataSource = new MatTableDataSource(this.data);
    }

    update(element: any) {
        console.log('Update:', element);
    }

    

    ngOnInit(): void {
        this.listing();
    }

    listing(_limit: number = 15, _page: number = 1, _key: string = ''): void {
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

    // change the data format to dd-mm-yy
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }

    delete(item: any){
        this._service.delete(item.id).subscribe({
            next: res => {
                this._snackbarService.openSnackBar("ការលុបទទួលបានជោគជ័យ", GlobalConstants.success);
                this.listing();
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

    view(item: any): void {
        this._router.navigateByUrl(`/year/view/${item.id}`)
       }

    // change color of the status
    getStatusClass(status: string): string {
        switch (status) {
            case 'ទទួលពាក្យ':
                return 'text-yellow-500';
            case 'ដំណើការ':
                return 'text-green-500';
            case 'បញ្ចប់':
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    }

    // create(): void {
    //     const dialogConfig = new MatDialogConfig();
    //     // dialogConfig.data = { row, id: this._id };
    //     dialogConfig.position = { right: '0', top: '0' };
    //     dialogConfig.height = '100vh';
    //     dialogConfig.panelClass = 'side-dialog';
    //     dialogConfig.autoFocus = false;
    
    //     const dialogRef = this._matDialog.open(YearCreateComponent, dialogConfig);
    //     dialogRef.afterClosed().subscribe(() => {
    //         this.listing();
    //     });
     
    // }
}
