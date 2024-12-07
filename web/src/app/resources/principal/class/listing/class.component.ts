import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ClassroomService } from '../class.service';
import { Academic, Classrooms } from '../classroom.type';
import { GlobalConstants } from 'helper/shared/constants';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { helperAnimations } from 'helper/animations';
import { CommonModule } from '@angular/common';
import { Classroom } from 'app/resources/general-manager/branch/branch.type';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { env } from 'envs/env';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrincipalClassroomCreateComponent } from '../create/create.component';
import { number } from 'echarts';
import { SearchClassDialogComponent } from '../search/search.component';


@Component({
    selector: 'principal-class',
    standalone: true,
    imports: [
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonToggleModule,
        MatMenuModule,
        MatButtonModule,
        CommonModule,
        MatTableModule,
        MatMenuModule
    ],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
    animations: helperAnimations
})
export class ClassComponent {

    key: string = '';
    branch_id: number = 0;
    hideMultipleSelectionIndicator = signal(true);
    public isloading = false;  
    fileUrl: string = env.FILE_BASE_URL;
    displayedColumns: string[] = ['n', 'class', 'year', 'teacher', 'student', 'action'];
    public selectedValues: string[] = []; 


    public data: Classrooms[] = [];
    public class_data: Classrooms[] = [];

    public dataSource: MatTableDataSource<Classrooms> = new MatTableDataSource<Classrooms>([]);

    public academics: Academic[] =[];
    public academic_name : string = '';

    public search_branch: number;
    public search_level: number;
    public search_academic: number = 0;
    public search_room: number = 0;
    public search_schedule: number = 0;
    public search_grade: number = 0;


    constructor(
        private _router: Router,
        private _classroomService: ClassroomService,
        private _snackbarService: SnackbarService,
        private _matDialog: MatDialog
    ) {
        
    }
    ngOnInit(): void {
        this.setup();
        this.listing();
    }
    onSelectionChange(event: any): void {
        
        const selectedAcademic = this.academics.find(item => item.academic_name === event.value);

       
        if (selectedAcademic) {
            console.log('Selected Academic Name:', selectedAcademic.academic_name);
            this.academic_name = selectedAcademic.academic_name; // Store the selected academic name
        } else {
            this.academic_name = ''; // If 'All' is selected (value = 0), show all data
        }
        this.filterClassData();
    }


    filterClassData(): void {
        if (this.academic_name) {
            // Filter class_data based on academic_name
            this.dataSource.data = this.class_data.filter(classroom => classroom.academic_name === this.academic_name);
        } else {
            // If no academic_name is selected or 'All' is selected, show all classes
            this.dataSource.data = this.class_data;
        }
    }


    toggleMultipleSelectionIndicator() {
        this.hideMultipleSelectionIndicator.update(value => !value);
    }
    view(item: Classrooms): void {
        this._router.navigateByUrl(`principal/class/view/${item.id}`) ;
    }

    setup(){
        this._classroomService.setup( ).subscribe({
            next: res => {
                this.academics = res.academics;  
             
                // Check if 'res' and 'res.classroom' are defined
            },
            error: err => {
                this.isloading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }
    listing( ): void {
        const param: { key?: string  , academic?: number , levelid?: number , roomid?: number , gradeid?: number , scheduleid?: number } = {
        };
        if (this.key != '') {
            param.key = this.key;
        }
        if (this.search_level != 0) {
            param.levelid = this.search_level;
        }
        if (this.search_room != 0) {
            param.roomid = this.search_room;
        }
        if (this.search_grade != 0) {
            param.gradeid = this.search_grade;
        }
        if (this.search_schedule != 0) {
            param.scheduleid = this.search_schedule;
        }
        // if (this.academic_id != 0 ) {
        //     param.academic = this.academic_id;
        // }else{
        // }
        this.isloading = true;
        this._classroomService.listing(param).subscribe({
            next: res => {
                this.data = res.classrooms;
                this.class_data = this.data;
                // Check if 'res' and 'res.classroom' are defined
                this.dataSource.data = this.class_data;
                console.log(this.data)
                this.isloading = false; // Set loading to false once the data is processed
            },
            error: err => {
                this.isloading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
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
    
    create(): void {
        const dialogConfig = new MatDialogConfig();
        // dialogConfig.data = { row, id: this._id };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef = this._matDialog.open(PrincipalClassroomCreateComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(() => {
            this.academic_name = '';
            this.listing();
        });
     
    }

    search(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        // dialogConfig.data = this.path;
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(SearchClassDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
            if(result){
                this.search_branch = result.branchId ;
                this.search_level = result.levelid ;
                this.search_academic = result.academicid ;
                this.search_room = result.roomid ;
                this.search_schedule = result.scheduleid ;
                this.search_grade = result.gradeid ;

                this.listing();  
            }   
        });
    }
}
