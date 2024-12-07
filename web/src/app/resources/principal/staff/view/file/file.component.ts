import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, Input, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeplerImgViewerComponent } from 'helper/components/img-viewer/img-viewer.component';
import { HeplerPdfViewerComponent } from 'helper/components/pdf-viewer/pdf-viewer.component';
import { url } from 'inspector';
import { env } from 'envs/env';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BrowserModule } from '@angular/platform-browser';

import { SankeySeriesOption } from 'echarts';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';
import { StaffService } from '../../staff.service';
import { FileData } from '../../staff.type';

@Component({
    selector: 'prinicple-view-employee-file',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatIconModule,
        MatCheckbox,
        MatTableModule,
        MatMenuModule,
        HeplerImgViewerComponent,
        HeplerPdfViewerComponent,
        PdfViewerModule,
    ],
    templateUrl: './file.component.html',
    styleUrl: './file.component.scss'
})
export class ViewEmployeeFileComponent {
    isGrid: boolean = false;
    fileUrl: string = env.FILE_BASE_URL;
    public data: FileData[];

    @Input() id!: number;
    displayedColumns: string[] = ["checkbox" ,'profile', 'create', 'size',  'action'];
    sortOrder: 'asc' | 'desc' = 'desc'; // Default sort order
    currentSortKey: string = ''; // Track the current sort key
    dataSource: MatTableDataSource<FileData> = new MatTableDataSource<FileData>([
  
    ]);
    previewFile: { file: File, url: string, type: string }

    constructor(
        private _dialog: Dialog,
        private _matDialog: MatDialog,
        private _fileService: StaffService,
        private _snackbarService: SnackbarService,
        private _cd: ChangeDetectorRef,
    ){}
    

    ngOnInit(): void {
        this.listing();
       
    }

    listing(): void {
        this._fileService.view( this.id ).subscribe({
            next: res => {
                
                this.data = res.file;
                // Check if 'res' and 'res.classroom' are defined
                this.dataSource.data = this.data;
                
         
                return
            },
            error: err => {
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

  

    getRowClass(row: any): string {
        // Assuming the dataSource is an array and we can use the index to determine odd/even
        const index = this.dataSource.data.indexOf(row);
        return index % 2 === 0 ? 'even-row' : 'odd-row';
    }

    ChangeView(){
        this.isGrid = !this.isGrid;  
    }



  sortBy(key: string) {
        // Check if the clicked key is the same as the current sort key
        const isSameKey = this.currentSortKey === key;

        this.dataSource.data = [...this.dataSource.data].sort((a, b) => {
            if (key === 'size') {
                return this.sortOrder === 'asc' ? a.size - b.size : b.size - a.size; // Sort by size
            } else if (key === 'name') {
                return this.sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name); // Sort by name
            } else if (key === 'creator_name') {
                return this.sortOrder === 'asc' ? a.creator_name.localeCompare(b.creator_name) : b.creator_name.localeCompare(a.creator_name); // Sort by creator_name
            }
            return 0; // Default case, no sorting applied
        });

        // Toggle the sort order if the same key is clicked
        this.sortOrder = isSameKey ? (this.sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
        this.currentSortKey = key; // Update current sort key

        // Update the data source
        this.dataSource._updateChangeSubscription();
    }

    viewFile(item: FileData ): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            // url: this.attachments ? this.fileUrl + previewFile.url : previewFile.url,
            url:this.fileUrl + item.uri ,
            // title: previewFile.file.name,
            title: item.name
        };
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0px' };
        dialogConfig.height = '100dvh';
        dialogConfig.width = '100dvw';
        dialogConfig.maxWidth = '100dvw';
        dialogConfig.panelClass = 'custom-mat-dialog-full';
        dialogConfig.enterAnimationDuration = '0s';
        // this._matDialog.open(HeplerPdfViewerComponent, dialogConfig);
        item.file_type === 'pdf' ? this._matDialog.open(HeplerPdfViewerComponent, dialogConfig) : this._matDialog.open(HeplerImgViewerComponent, dialogConfig);
    }


    downloadFile(item: FileData): void {
        // Fetch the file from the URL
        fetch(this.fileUrl + item.uri)
          .then(response => response.blob()) // Convert the response to a blob
          .then(blob => {
            // Create a link element
            const link = document.createElement('a');
            // Create a blob URL for the file
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            // Set the download attribute with the desired file name
            link.download = item.name; // Modify this to your desired file name
            // Append the link to the DOM
            document.body.appendChild(link);
            // Programmatically click the link to trigger the download
            link.click();
            // Remove the link from the DOM
            document.body.removeChild(link);
            // Revoke the object URL to free up resources
            window.URL.revokeObjectURL(url);
          })
          .catch(err => console.error('Download failed:', err));
      }

    // removeFile(name: string): void {
    //     this.previewFiles = this.previewFiles.filter(v => v.file.name != name);
    //     this.filesChange.emit(this.previewFiles);
    // }
}


