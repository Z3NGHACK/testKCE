import { CommonModule } from '@angular/common';
import { Component, computed, Input, input, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeplersImgViewerComponent } from 'app/shared/img-viewer/img-viewer.component';
import { HeplersPdfViewerComponent } from 'app/shared/pdf-viewer/pdf-viewer.component';
import { env } from "envs/env";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { UploadFileComponent } from './create/create.component';

@Component({
    selector: 'shared-view-student-file',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatIconModule,
        MatCheckbox,
        MatTableModule,
        MatMenuModule
    ],
    templateUrl: './file.component.html',
    styleUrl: './file.component.scss'
})
export class StudentFileComponent {
    isGrid: boolean = false;
    @Input() data: any;
    @Input() id: number;
    fileUrl: string = env.FILE_BASE_URL;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([
        {
            avatar: 'https://example.com/avatar1.png',
            name: 'លោក​ ជឹម​ គឹមឡាយ',
            size: '0.4 mb',
            file: 'Passport',
            create_at: '1 ថ្ងៃមុន',
        },
        {
            avatar: 'https://example.com/avatar1.png',
            name: 'លោក​ ជឹម​ គឹមឡាយ',
            size: '0.4 mb',
            file: 'ID Card',
            create_at: '1 ថ្ងៃមុន',
        }
    ]);

    displayedColumns: string[] = ["checkbox", 'profile', 'create', 'size', 'action'];

    selectedFiles: any[] = [];  // To store selected files
    selectAllChecked: boolean = false;  // For 'select all' action

    constructor(private matDialog: MatDialog) { }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data);
        // Initialize checked property in data
        this.dataSource.data.forEach(file => file.checked = false);
    }

    getRowClass(row: any): string {
        const index = this.dataSource.data.indexOf(row);
        return index % 2 === 0 ? 'even-row' : 'odd-row';
    }

    // File viewer method
    viewer(file: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            url: this.fileUrl + file.uri,
            title: file.name
        };
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0px' };
        dialogConfig.height = '100dvh';
        dialogConfig.width = '100dvw';
        dialogConfig.maxWidth = '100dvw';
        dialogConfig.panelClass = 'custom-mat-dialog-full';
        dialogConfig.enterAnimationDuration = '0s';
        file.type_id = file.extension.name.toLowerCase() == 'pdf'
            ? this.matDialog.open(HeplersPdfViewerComponent, dialogConfig)
            : this.matDialog.open(HeplersImgViewerComponent, dialogConfig);
    }

    // File download method
    downloadImage(item): void {
        fetch(this.fileUrl + item.uri, { mode: 'cors' })
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.download = item.title || 'downloaded-image';
                link.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error downloading the image:', error);
            });
    }
    downloadAsZip(selectedFiles: any[]): void {
        if (selectedFiles.length === 0) {
            console.error('No files selected for download.');
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder('downloaded-files');

        const filePromises = selectedFiles.map(item => {
            return fetch(this.fileUrl + item.uri)
                .then(response => response.blob())
                .then(blob => {
                    folder.file(item.name || 'file', blob);  // Add each file to the zip
                })
                .catch(error => {
                    console.error('Error fetching file:', error);
                });
        });

        // Wait for all files to be added to the zip
        Promise.all(filePromises).then(() => {
            zip.generateAsync({ type: 'blob' }).then(content => {
                saveAs(content, 'files.zip');  // Trigger the download of the zip
            });
        });
    }
    // Select or deselect a single file
    selectFile(item: any): void {
        item.checked = !item.checked;
        this.updateSelectedFiles();
    }

    // Select or deselect all files
    selectAll(): void {
        this.selectAllChecked = !this.selectAllChecked;
        this.dataSource.data.forEach(file => {
            file.checked = this.selectAllChecked;
        });

        this.updateSelectedFiles();

    }

    // Update the selectedFiles array
    updateSelectedFiles(): void {
        this.selectedFiles = this.dataSource.data.filter(file => file.checked);
        this.selectAllChecked = this.selectedFiles.length == this.dataSource.data.length;
    }
    upload() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { id: this.id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this.matDialog.open(UploadFileComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                this.data = res;
                this.dataSource = new MatTableDataSource(this.data);
            }
        });
    }

    ChangeView() {
        this.isGrid = !this.isGrid;
    }
}
