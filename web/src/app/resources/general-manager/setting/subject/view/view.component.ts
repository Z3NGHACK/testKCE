import { SnackbarService } from "helper/services/snack-bar/snack-bar.service";
import { SubjectService } from "../subject.service";
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { GlobalConstants } from "helper/shared/constants";
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { env } from "envs/env";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AddRateComponent } from "./add-rate/add-rate.component";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { UpdateSubjectComponent } from "../update/update.component";
import { UpdateRateComponent } from "./update-rate/update-rate.component";
import { AddSubjectComponent } from "./add-subject/add-subject.component";
import { UpdateEachSubjectComponent } from "./update-subject/update-subject.component";

@Component({
  selector: 'view-language',  // Define the selector for this component
  templateUrl: './view.component.html',  // Path to the HTML file
  styleUrls: ['./view.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    MatDialogModule,
    MatTableModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ], 
})
export class ViewComponent {
  @Output() updateData: EventEmitter<any> = new EventEmitter<any>();
  public showForm: boolean = true; // Tracks form visibility
  public id: number = 0;
  public rates: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  SubjectdataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  fileUrl: string = env.FILE_BASE_URL;
  @Output() output = new EventEmitter<string>();
  public data:any;
  // public formData = {
  //   grade: '',
  //   from: null,
  //   to: null,
  // };
  public displayedColumns: string[] = ['id', 'range', 'grade', 'actions']; // Define table columns
  public SubjectdisplayedColumns: string[] = ['id', 'subject', 'actions']; 

  constructor(
    private _service: SubjectService, 
    private _snackbarService: SnackbarService,
    private _dialogRef: MatDialogRef<ViewComponent>,
    private cdRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public datas: any,
      
  ) {  
    this.listing()
  }
  // openFormOverlay(): void {
  //   // this.showForm = false;
  //   const dialogRef = this.dialog.open(AddRateComponent, {
  //     width: '400px',
  //     height: '500px',
  //     data: { id: this.data.id,
  //       rates: this.data.rates },
  //   }); }

  listing():void {
    this._service.view(this.datas.id).subscribe({
       next: res => {
          this.data = res?.data;
          this.dataSource.data = this.data.rates;
          this.SubjectdataSource.data = this.data.subjects;
          console.log(this.SubjectdataSource.data)
           // this.isLoading = false;
       },
       error: err => {
           // this.isLoading = false;
           this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
       }
   });
}

  // Toggle the form visibility
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
   
  ngOnInit() {
    console.log('ngOnInit:', this.data);
    // this.fetchRates();
  }

  ngAfterViewInit() {
    this.fetchRates();
      console.log('ngAfterViewInit:', this.data);
  }
  // ngOnInit(): void{
  //   this.fetchRates(this.id);  
  //   this.output.emit("this does not trigger a new change detection");
  // }
  // ngAfterContentInit(): void{
  //   this.fetchRates(this.id);
  //   this.cdRef.detectChanges();
    
  // }
  
  udpate(){
    console.log(this._snackbarService);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data =  this.data;
    dialogConfig.position = { right: '0', top: '0' };
    dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'side-dialog';
    dialogConfig.autoFocus = false;

    const dialogRef = this._matDialog.open(UpdateSubjectComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
        if(result){
          // this.listing();
          // setTimeout(() => this.listing(), 1);
          this.data.icon = result.data.icon;
          this.data.name = result.data.name;
          this.updateData.emit(result.data);
          // console.log(result.data)
        }
    });
  }


  addRate(){
    console.log(this._snackbarService);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data =  this.data;
    dialogConfig.position = { right: '0', top: '0' };
    dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'side-dialog';
    dialogConfig.autoFocus = false;

    const dialogRef = this._matDialog.open(AddRateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
        if(result){
          this.data.rates.push(result) ;
          this.dataSource.data = this.data.rates;
        }
    });
  }


  createSubject(){
    console.log(this._snackbarService);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data =  this.data;
    dialogConfig.position = { right: '0', top: '0' };
    dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'side-dialog';
    dialogConfig.autoFocus = false;

    const dialogRef = this._matDialog.open(AddSubjectComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
        if(result){
          this.data.subjects.push(result) ;
          this.SubjectdataSource.data = this.data.subjects;
        }
    });
  }



  // Fetch rates from the API
  fetchRates(): void {
    this._service.view(this.datas.id).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.data = response.data;
          console.log(response)
          // this.data.icon = response.data.icon;
          // this.rates = response.data.rates || [];
          console.log('Rates:', this.rates);
        } else {
          
          this._snackbarService.openSnackBar('No rates found', 'Warning');
        }
      },
      error: (err) => {
        console.error('Error fetching rates:', err);
        this._snackbarService.openSnackBar('Error fetching rates', 'Error');
      }
    });
  }
  


  // Optionally, add functions to edit and delete rates
  editRate(item: any){
    console.log(this._snackbarService);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {  data: item , id: this.data.id }
    dialogConfig.position = { right: '0', top: '0' };
    dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'side-dialog';
    dialogConfig.autoFocus = false;

    const dialogRef = this._matDialog.open(UpdateRateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Find the index of the item in the array where id matches result.id
        const index = this.data.rates.findIndex(item => item.id === result.id);
        const dataindex = this.dataSource.data.findIndex(item => item.id === result.id);
    
        if (index !== -1) {
          this.data.rates[index].from = result.from; 
          this.data.rates[index].to = result.to;    
          this.data.rates[index].grade = result.grade;    
        }
        
        if (dataindex !== -1) {
        
          this.dataSource.data[dataindex].from = result.from; 
          this.dataSource.data[dataindex].to = result.to;    
          this.dataSource.data[dataindex].grade = result.grade;    
        }
        
      }
    });
  }


  editSubject(item: any){
    console.log(this._snackbarService);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {  data: item , id: this.data.id }
    dialogConfig.position = { right: '0', top: '0' };
    dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'side-dialog';
    dialogConfig.autoFocus = false;

    const dialogRef = this._matDialog.open(UpdateEachSubjectComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.data.subjects.findIndex(item => item.id === result.id);
        const dataindex = this.SubjectdataSource.data.findIndex(item => item.id === result.id);
    
        if (index !== -1) { 
          this.data.subjects[index].name = result.name;    
        }
        
        if (dataindex !== -1) {  
          this.SubjectdataSource.data[dataindex].name = result.name;    
        }
        
      }
    });
  }
  
  deleteRate(id: number): void {
    this._service.deleteRate(id, this.data.id).subscribe({
      next: (response) => {
        // Remove the deleted rate from the local data object
        this.data.rates = this.data.rates.filter(rate => rate.id !== id);
        
        // Optionally update the data source if you are using a data table
        this.dataSource.data = this.data.rates;
        this._snackbarService.openSnackBar('ការលុបទទួលបានជោគជ័យ', GlobalConstants.success);
  
        // Optionally, you might want to refresh the rates or do other UI updates
        // this.fetchRates(this.data.id); // Uncomment this if you want to refresh after deletion
      },
      error: (err) => {
        this._snackbarService.openSnackBar('Error deleting rate', GlobalConstants.error);
      }
    });
  }

  deleteEachSubject(id: number): void {
    this._service.deleteEachSubject(id, this.data.id).subscribe({
      next: (response) => {
        // Remove the deleted rate from the local data object
        this.data.subjects = this.data.subjects.filter(rate => rate.id !== id);
        
        // Optionally update the data source if you are using a data table
        this.SubjectdataSource.data = this.data.subjects;
        this._snackbarService.openSnackBar('ការលុបទទួលបានជោគជ័យ', GlobalConstants.success);
  
        // Optionally, you might want to refresh the rates or do other UI updates
        // this.fetchRates(this.data.id); // Uncomment this if you want to refresh after deletion
      },
      error: (err) => {
        this._snackbarService.openSnackBar('Error deleting rate', GlobalConstants.error);
      }
    });
  }

  closeDialog(): void {
    this._dialogRef.close();
  }
}
