import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { env } from 'envs/env';
import moment from 'moment';
import { ProgramService } from '../program.service';
import { limits } from 'chroma-js';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { CreateProgramComponent } from '../create/create.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';


@Component({
    selector: 'general-manager-program',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        MatTableModule,
        FormsModule,
        MatMenuModule,
        MatPaginatorModule
        
      ],
    templateUrl: './program.component.html',
    styleUrl: './program.component.scss'
})
export class ProgramComponent implements OnInit{


    public isSearching: boolean = false;
    public data: any[] = [];
    public displayedColumns: string[] = ['name','type','start','end','action'];
    public dataSource: any;
    public key: string;
    public page: number = 1;
    public limit: number = 15;
    public total: number = 0;

    constructor(
      private _service: ProgramService,
      private _router: Router,
      private _matDialog: MatDialog,
      private _snackBarService: SnackbarService
    ){};

  update(element: any) {
    console.log('Update:', element);
  }

  
  ngOnInit(): void {
    this.listing();
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
      this._service.listing(param).subscribe((res:any)=>{
        this.isSearching = false;
        this.data = res?.data;
        this.total = res?.pagination.total_items;
        this.page = res?.pagination.current_page;
        this.limit = res?.pagination.per_page;
        this.dataSource = new MatTableDataSource(this.data);
        console.log(this.data)

    });
  }

  

  view(item: any): void {
   this._router.navigateByUrl(`/program/view/${item.id}`)
  }

  onPageChanged(event: PageEvent) {
    if (event && event.pageSize) {
        this.limit = event.pageSize;
        this.page = event.pageIndex + 1;
        this.listing(this.limit, this.page);
    }
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = { right: '0', top: '0' };
    dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'side-dialog';
    dialogConfig.autoFocus = false;

    const dialogRef = this._matDialog.open(CreateProgramComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.listing();
  });
  }


  delete(item: any){
    this._service.deleteProgram(item.id).subscribe({
        next: res => {
            this._snackBarService.openSnackBar("ការលុបទទួលបានជោគជ័យ", GlobalConstants.success);
            this.listing();
        },
        error: err => {
            // this.isLoading = false;
            this._snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        }
    });
}
}

