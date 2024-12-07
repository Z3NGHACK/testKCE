import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { env } from 'envs/env';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatSliderModule} from '@angular/material/slider';
import { TeacherService } from 'app/resources/teacher/teacher.service';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
// import { ClassroomCreteScoreComponent } from '../create-score/create-score.component';


@Component({
    selector: 'shared-view-classroom-monthly-report',
    standalone: true,

    imports: [
        MatIconModule,
        PortraitComponent,
        MatIconButton,
        CommonModule,
        MatDialogModule,
        MatMenu,
        MatMenuModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
        MatSliderModule,
        FormsModule,

    ],
    templateUrl: './monthly-report.component.html',
    styleUrl: './monthly-report.component.scss'
})
export class SharedClassroomMonthlyReportComponent {
    loading:boolean=true;
    categories:any[]=[];
    path: 'principal' | 'general-manager';
    constructor(
        public dialogRef: MatDialogRef<SharedClassroomMonthlyReportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialog: MatDialog,
        private _service: SharedTeacherService
    ) {
        this.path = this.data.path;
        this.listing();

    }

    listing(){
        this.loading=true;
        this._service.monthlyReport(this.path,this.data.data.class_id,this.data.item.id,this.data.data.user_id,{ mon_id:this.data.data.data.id}).subscribe((res:any)=>{
            this.categories=res.categories;
            this.loading=false;

        })
    }
    // craeScore(item:any){
    //         const dialogConfig = new MatDialogConfig();
    //         dialogConfig.data =  {data:this.data,item:item,language_id:this.data.l_id};
    //         dialogConfig.position = { right: '0', top: '0' };
    //         dialogConfig.height = '100vh';
    //         dialogConfig.panelClass = 'side-dialog';
    //         dialogConfig.autoFocus = false;
    //         const dialogRef = this._matDialog.open(ClassroomCreteScoreComponent, dialogConfig);
    //         dialogRef.afterClosed().subscribe(() => {
    //               this.listing();
    //             });

    // }
    closeDialog(): void {
        this.dialogRef.close();
    }
}
