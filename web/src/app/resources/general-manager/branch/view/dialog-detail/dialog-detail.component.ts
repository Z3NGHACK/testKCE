import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogConfig,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { env } from 'envs/env';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Data } from '@angular/router';
import teacherRoutes from 'app/resources/teacher/teacher.routes';
import { from } from 'rxjs';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { ReceptionistService } from 'app/resources/receptionist/receptionist.service';
import { ClassroomService } from 'app/resources/principal/class/class.service';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { BranchService } from '../../branch.service';
import { HeplerPdfViewerComponent } from 'helper/components/pdf-viewer/pdf-viewer.component';
import { HeplerImgViewerComponent } from 'helper/components/img-viewer/img-viewer.component';
import { ViewDialogClassComponent } from '../view-class/view-class.component';

// import { PrincipleClassroomReportDialogComponent } from '../report/report.component';
// import { PrincipleClassroomAttendanceComponent } from '../classroom-attendance/classroom-attendence.component';

@Component({
    selector: 'shared-view-student-classroom-detail',
    standalone: true,
    imports: [
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
    ],
    templateUrl: './dialog-detail.component.html',
    styleUrl: './dialog-detail.component.scss',
})

export class ViewDialogDetailComponent {

    fileUrl: string = env.FILE_BASE_URL;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    // path: 'principal' | 'general-manager';
    user: any;

    report:any={};
    loading=true;;

    displayedColumns: string[] = ['name', 'author', 'file',  'action'];
    sortOrder: 'asc' | 'desc' = 'desc'; // Default sort order
    currentSortKey: string = ''; // Track the current sort key
    path: 'teacher' | 'staff' | 'student';

    constructor(
        public dialogRef: MatDialogRef<ViewDialogDetailComponent>,
        private _matDialog: MatDialog,
        private _activatedRoute: ActivatedRoute,
        private _service: BranchService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.path = this.data.path;
        console.log(this.path)
        this.loading=true;
        this._service.viewUser(this.path , this.data.id).subscribe((res:any)=>{
            this.user = res;
            console.log(this.user);
            this.dataSource.data = this.user.file;
            // this.attendents=res.attendents;
            // this.report=res.report;
            // this.dataSource=new MatTableDataSource(this.attendents);
            this.loading=false;
        })

    }
    student = this.data.data;
    attendents:any[]=[];
    total_a:number=0;
    total_p:number=0;
    ngOnInit(): void {

        console.log(this.data.data.id);


        // this.viewReport();
    }

    formatPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }

    getlanguage(status: string): string {
        switch (status) {
          case 'ខ្មែរ':
            return 'bg-blue-600';
          case 'អង់គ្លេស':
            return 'bg-blue-800';
          default:
            return 'bg-blue-400';
        }
    }

    
    closeDialog(): void {
        this.dialogRef.close();
    }

    getStatusSituation(status: string): string {
        switch (status) {
            case 'អវត្តមាន':
                return 'text-red-500';

            case 'វត្តមាន':
                    return 'text-green-500';
            default:
                return 'text-yellow-500';
        }
    }
    // viewReport(item:any): void {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.data = { from: this.path ,data:item,title:this.student.name,class_id:this.data.id,user_id:this.data.data.id };
    //     dialogConfig.position = { right: '0', top: '0' };
    //     dialogConfig.height = '100vh';
    //     dialogConfig.panelClass = 'side-dialog';
    //     dialogConfig.autoFocus = false;

    //     const dialogRef = this._matDialog.open(
    //         SharedTeacherClassroomReportDialogComponent,
    //         dialogConfig
    //     );

    //     // dialogRef.afterClosed().subscribe(() => {
    //     //   this.listing();
    //     // });
    // }

    viewDetail(row: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data =  row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            ViewDialogClassComponent,
            dialogConfig
        );

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }
    convertToKhmerMonth(dateString: string): string {
        const khmerMonths = [
            "មករា",  // January
            "កុម្ភៈ",  // February
            "មីនា",  // March
            "មេសា",  // April
            "ឧសភា",  // May
            "មិថុនា",  // June
            "កក្កដា",  // July
            "សីហា",  // August
            "កញ្ញា",  // September
            "តុលា",  // October
            "វិច្ឆិកា",  // November
            "ធ្នូ"    // December
        ];

        const date = new Date(dateString);
        const month = date.getMonth();  // 0-11
        const year = date.getFullYear();  // Get the full year

        // Combine the Khmer month and year
        return `${khmerMonths[month]} ${year}`;
    }


    viewFile(item: any ): void {
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


    downloadFile(item: any): void {
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

}
