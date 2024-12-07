import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { env } from 'envs/env';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { SharedViewReportDetailComponent } from './detail/detail.component';
// import { TeacherViewReportDetailComponent } from './detail/detail.component';

@Component({
    selector: 'shared-class-room-report',
    standalone: true,
    imports: [
        MatIconModule,
        MatDialogModule,
        CommonModule,
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        MatMenu,
        MatMenuModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
    ],
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss'
})
export class SharedClassRoomReportComponent {
    @Input() id:any;
    @Input() path: 'principal' | 'general-manager';
    loading:boolean=true;
    data:any;
    fileUri=env.FILE_BASE_URL;

    constructor(
        private _matDialog: MatDialog,
        private _service: SharedTeacherService
    ){}
    ngOnInit():void{
        this.loading=true;
        if(this.path === 'general-manager'){
            this._service.getreports(this.path,this.id).subscribe((res:{data:any})=>{
                this.data=res.data;
                console.log(this.data)
                this.loading=false
            });
        }else{
            this._service.Principalgetreports(this.path,this.id).subscribe((res:{data:any})=>{
                this.data=res.data;
                console.log(this.data)
                this.loading=false
            });
        }
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

    viewReport(item:any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { id:this.id , month:item , path: this.path};
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            SharedViewReportDetailComponent,
            dialogConfig
        );

        // dialogRef.afterClosed().subscribe(() => {
        //   this.listing();
        // });
    }
}


