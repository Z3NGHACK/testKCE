import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { env } from 'envs/env';
import { SubjectService } from '../subject.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { helperAnimations } from 'helper/animations';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { CreateSubjectComponent } from '../create/create.component';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { ViewComponent } from '../view/view.component';
import { Subject } from '../subject.type';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
import { CreateScoreCategoryComponent } from '../create-score-category/create-score-category.component';
import { UpdateScoreCategoryComponent } from '../update-score-category/update-score-category.component';

@Component({
    selector: 'general-manager-setting-subject',
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
        MatTooltipModule,
        MatDialogModule,
        MatButtonModule
    ],
    templateUrl: './subject.component.html',
    styleUrl: './subject.component.scss',
    animations: helperAnimations
})
export class SettingSubjectComponent {
    public isSearching: boolean = false;
    public data: any[] = [];
    displayedColumns: string[] = ['name','subject', 'action'];
    SubjcetScoredisplayedColumns: string[] = ['name', 'action'];
    public dataSource: MatTableDataSource<any>;
    public subjectScoredataSource: MatTableDataSource<any>;
    public key: string;
    public page: number = 1;
    public limit: number = 15;
    public total: number = 0;
    fileUrl: string = env.FILE_BASE_URL;
    public totalSubjects: number = 0; 

    public scoreCategory: any;
    
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _snackbarService: SnackbarService,
        private _router: Router,
        private _service: SubjectService,
        private _matDialog: MatDialog, 
        private cdRef: ChangeDetectorRef,
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
    
        // Add search key to params if provided
        if (_key.trim() !== '') {
            param.key = _key;
        }
    
        this.isSearching = true; // Set loading state to true
    
        this._service.listing(param).subscribe(
            (res: any) => {
                this.isSearching = false; // Stop the loading state
    
                // Assign the response data
                this.data = res?.data || [];  // Ensure data is assigned or default to an empty array
                
                this.totalSubjects = res?.total_subjects;
                // Set the data source for MatTable
                this.dataSource = new MatTableDataSource(this.data);
    
    
            },
            (error) => {
                this.isSearching = false;  // Stop the loading state in case of error
                console.error('Error fetching data:', error);  // Handle error
            }
        );


        this._service.getScoreCategory().subscribe({
            next: res => {
                this.scoreCategory = res.score_categories;
                this.subjectScoredataSource = new MatTableDataSource(this.scoreCategory); 
                console.log(this.subjectScoredataSource.data)
                 
                console.log(this.subjectScoredataSource.data)
            },
            error: err => {
               
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
    create(){
        console.log(this._snackbarService);
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(CreateSubjectComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(() => {
          this.listing();
          setTimeout(() => this.listing(), 1);
        });
    }


    createScoreCategory(){
        console.log(this._snackbarService);
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(CreateScoreCategoryComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(() => {
          this.listing();
          setTimeout(() => this.listing(), 1);
        });
    }

    updateScoreCategory(row: any){
        console.log(this._snackbarService);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(UpdateScoreCategoryComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(() => {
          this.listing();
          setTimeout(() => this.listing(), 1);
        });
    }



    delete(id: number): void {

        this._service.deleteSubject(id).subscribe(
            (response) => {
                this._snackbarService.openSnackBar('ការលុបទទូលបានជោគជ័យ', GlobalConstants.success);
                this.listing();  // Refresh the list of subjects after deletion
            },
            (error) => {
                console.error('Error deleting subject:', error);
            }
        );
    }


    deleteScoreCategory(id: number): void {
        this._service.deleteScoreCategory(id).subscribe(
            (response) => {
                this._snackbarService.openSnackBar('ការលុបទទូលបានជោគជ័យ', GlobalConstants.success);
                this.listing();  // Refresh the list of subjects after deletion
            },
            (error) => {
                console.error('Error deleting subject:', error);
            }
        );
    }

    view(item: any): void {
        const dialogRef = this._matDialog.open(ViewComponent, {
          position: { right: '0px' },  
          height: '100dvh',
          data: item
        });

        dialogRef.componentInstance.updateData.subscribe(result => {
            if (result) {
                // Find the index of the item in the array where id matches result.id
                const index = this.data.findIndex(item => item.id === result.id);
            
                if (index !== -1) {
                  // Update the name and icon for the matched item
                  this.data[index].name = result.name;
                  this.data[index].icon = result.icon;
            
                  // Optionally, you can emit the updated name if needed
                  // this.UpdateName.emit(result.name); // Emit the updated data
                }
              }
          });
      
        dialogRef.afterClosed().subscribe(() => {
            this.listing();
        });
      }
      



}
