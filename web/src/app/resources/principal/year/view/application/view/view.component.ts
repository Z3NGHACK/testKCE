import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { ActivatedRoute } from '@angular/router';
import teacherRoutes from 'app/resources/teacher/teacher.routes';
import { from } from 'rxjs';

@Component({
    selector: 'view-application-prinicipal',
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
        MatTableModule
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss'
})
export class ViewApplicationComponent {

    fileUrl: string = env.FILE_BASE_URL;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([
        {
            name: 'តម្លៃសិក្សា',
            fullprice: '1566.00 $',
            price: '',
        },
        {
            name: 'តម្លៃចុះឈ្មោះ',
            fullprice: '50.00',
            price: '789.50',
        },
    ]);
    displayedColumns: string[] = ['name' ,'fullprice', 'price', 'action']; 
    constructor(
        public dialogRef: MatDialogRef<ViewApplicationComponent>,
        private _matDialog: MatDialog,
        private _activatedRoute: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      
    }

    ngOnInit(): void {  

      
    }

    formatPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    closeDialog(): void {
        this.dialogRef.close();
    }    
    

    getStatusSituation(status: string): string {
        switch (status) {
            case 'អវត្តមាន':
                return 'text-red-500';
            default:
                return 'text-yellow-500';
        }
    }



}
