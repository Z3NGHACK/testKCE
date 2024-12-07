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
import { LevelService } from '../level.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { helperAnimations } from 'helper/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateLevelComponent } from '../create/create.component';
import { UpdateLevelComponent } from '../update/update.component';
import { CreateComponent } from 'app/resources/receptionist/student/create/create.component';

@Component({
    selector: 'general-manager-setting-level',
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
    templateUrl: './level.component.html',
    styleUrl: './level.component.scss',
    animations: helperAnimations
})
export class SettingLevelComponent {
    public isSearching: boolean = false;
    public data: any[] = [];
    displayedColumns: string[] = ['name','class', 'action'];
    public dataSource: MatTableDataSource<any>;
    public key: string;
    public page: number = 1;
    public limit: number = 15;
    public total: number = 0;
    fileUrl: string = env.FILE_BASE_URL;
    
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _snackbarService: SnackbarService,
        private _router: Router,
        private _service: LevelService,
        private _matDialog: MatDialog,
    ) {
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
      
        this._service.listing(param).subscribe(
          (res: any) => {
            console.log('API Response:', res); // Debugging the API response
            this.isSearching = false;
            this.data = res?.data;
            // this.total = res?.pagination.total_items;
            // this.page = res?.pagination.current_page;
            // this.limit = res?.pagination.per_page;
            this.dataSource = new MatTableDataSource(this.data);
            console.log('Processed Data:', this.data);
          },
          (error) => {
            console.error('API Error:', error);
            this.isSearching = false;
          }
        );
      }
    //   create(){
    //     console.log(this._snackbarService);
    //     const dialogConfig = new MatDialogConfig();
    //     // dialogConfig.data =  row;
    //     dialogConfig.position = { right: '0', top: '0' };
    //     dialogConfig.height = '100vh';
    //     dialogConfig.panelClass = 'side-dialog';
    //     dialogConfig.autoFocus = false;
    
    //     const dialogRef = this._matDialog.open(CreateComponent, dialogConfig);
    
    //     dialogRef.afterClosed().subscribe(() => {
    //       this.listing();
    //       setTimeout(() => this.listing(), 1);
    //     });
    // }
  //   delete(id: number): void {
  //       console.log('ID for deletion:', id);  // Log the ID for debugging
  // }


      create(){
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(CreateLevelComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(() => {
            this.listing();
        });

    }

    update( item : any){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data =  item;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(UpdateLevelComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(() => {
            this.listing();
        });

    }

    onPageChanged(event: any) {
        // Handle page change event
        console.log('Page change event:', event);
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
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
}
