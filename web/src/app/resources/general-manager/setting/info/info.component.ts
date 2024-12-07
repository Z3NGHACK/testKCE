import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { env } from 'envs/env'; // Assuming you're importing environment variables
import { InfoService } from './info.service';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule
import { ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ViewComponent } from './view/view.component';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { UpdateSchoolComponent } from './update-school/update-school.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { StaffCreateComponent } from './create/create.component';

@Component({
  selector: 'general-manager-setting-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatRadioModule,
    CommonModule,
    MatMenuModule,
    PortraitComponent,
    RouterLink,
    RouterOutlet, 
    MatPaginatorModule,
    
  ]
})
export class SettingInfoComponent implements OnInit {
  public isSearching: boolean = false;
  public data: any[] = [];
  public showForm: boolean = false; 
  public showNewForm: boolean = false; 
  public showStaffTable: boolean = true;
  displayedColumns: string[] = ['name', 'contact', 'createdAt', 'actions'];
  fileUrl: string = env.FILE_BASE_URL;
  public profile: any;


  public key: string = '';
  public page: number = 1;
  public limit: number = 5;
  public total: number = 0;
  public totalSubjects: number = 0;

  constructor(
    private _service: InfoService,
    private router: Router,
    private _dialog: MatDialog,
    private _snackbarService: SnackbarService,
    private _matDialog: MatDialog,
  ){
  }
 
  // MatTableDataSource for staff table
  public staffData = new MatTableDataSource<Staff>([]);

  ngOnInit(): void {
    this.listing(this.limit, this.page); 
    this.fetchSchoolInfo();
    // this.loadStaffData();
  }

  // Fetch school info and update formData
  fetchSchoolInfo(): void {
    this._service.getSchoolInfo().subscribe({
      next: (res: any) => {
        console.log('API Data received:', res); // Log API response
        this.profile = res;
        
        
      },
      error: (err: any) => {
        console.error('Error fetching school info:', err); // Log error
      }
    });
  }

  udpate(item: any){
      console.log(this._snackbarService);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data =  item;
      dialogConfig.position = { right: '0', top: '0' };
      dialogConfig.height = '100vh';
      dialogConfig.panelClass = 'side-dialog';
      dialogConfig.autoFocus = false;

      const dialogRef = this._matDialog.open(UpdateSchoolComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            console.log(result)

            this.profile.kh_name = result.kh_name ;
            this.profile.en_name = result.en_name; 
            this.profile.phone1 = result.phone1; 
            this.profile.phone2 = result.phone2; 
            this.profile.address = result.address; 
            this.profile.email = result.email ;
            this.profile.website = result.website; 
            this.profile.logo = result.logo ; 
        }
    });
  }

  toggleStaffTable(): void {
    this.showStaffTable = !this.showStaffTable;
    console.log('showStaffTable:', this.showStaffTable);
  }

  // loadStaffData(): void {
  //   this._service.getStaffData().subscribe({
  //     next: (res) => {
  //       console.log('Fetched staff data:', res);
  //       this.staffData = res.data.map((staff: any) => ({
  //         id: staff.id,
  //         branchName: staff.branch?.name || 'N/A',
  //         avatar: staff.user?.avatar || 'assets/default-avatar.png',
  //         name: staff.user?.name || 'N/A',
  //         email: staff.user?.email || 'N/A',
  //         phone: staff.user?.phone || 'N/A',
  //         createdAt: staff.user?.created_at || null,
  //         updatedAt: staff.user?.updated_at || null,
  //       }));
  //       console.log('Mapped staff data:', this.staffData);
  //     },
  //     error: (err) => {
  //       console.error('Error loading staff data:', err);
  //     },
  //   });
  // }

  listing(_limit: number = 10, _page: number = 1): void {
    const param: { limit: number, page: number, key?: string } = {
        limit: _limit,
        page: _page
    };
    if (this.key != '') {
        param.key = this.key;
    }
    if (this.page != 0) {
        param.page = this.page;
    }
    // this.isSearching = true;
    this._service.listingStaff(param).subscribe({
      next: res => {
        this.data = res.data;
        this.total = res.pagination.total_items;
        this.page = res.pagination.current_page;
        this.limit = res.pagination.per_page;
        this.staffData.data = this.data;
        // this.paginateData(); 
        // this.isSearching = false;
      },
      error: err => {
        this.isSearching = false;
        this._snackbarService.openSnackBar(err?.error?.message || 'Error loading data', 'Error');
      }
    });
  }

  delete(item: any): void {
   
  
    this._service.deleteStaff(item.id).subscribe({
      next: res => {
        this.listing(this.limit, this.page);
        this._snackbarService.openSnackBar('ការលុបទទួលបានជោគជ័យ', 'sucess');

      },
      error: err => {
        this.isSearching = false;
        this._snackbarService.openSnackBar(err?.error?.message || 'Error loading data', 'Error');
      }
    });
  }



  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = { right: '0', top: '0' };
    dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'side-dialog';
    dialogConfig.autoFocus = false;

    const dialogRef = this._matDialog.open(StaffCreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
        this.listing(this.limit, this.page);
    });
  }  


  viewdetail(row: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = row,
    dialogConfig.position = { right: '0', top: '0' };
    dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'side-dialog';
    dialogConfig.autoFocus = false;

    const dialogRef: MatDialogRef<ViewComponent> = this._matDialog.open(ViewComponent, dialogConfig);
    dialogRef.componentInstance.updateData.subscribe(result => {
      if (result) {
        console.log(result)
          // Find the index of the data where the result id matches the data id
          const index = this.data.findIndex(item => item.id === result.id);
          
          if (index !== -1) {
              // Update the specific item at the found index
              this.data[index].name = result.name;
              this.data[index].avatar = result.avatar;
              this.data[index].phone = result.phone;
              this.data[index].email = result.email;
              this.data[index].created_at = result.created_at;
              this.data[index].level = result.level;
              this.data[index].sex_id = result.sex_id;
              this.data[index].sex = result.sex;
              this.data[index].roles = result.roles;
              this.data[index].role_ids = result.role_ids;
          }
      }
  });
  }
  
  paginateData(): void {
    if (Array.isArray(this.data)) {  // Ensure `this.data` is an array before slicing
      const startIndex = (this.page - 1) * this.limit;
      const endIndex = startIndex + this.limit;
      this.staffData.data = this.data.slice(startIndex, endIndex); // Slice the data
    } else {
      console.error('Data is not an array:', this.data); // Log error if `data` is not an array
    }
  }
  
  onPageChanged(event: PageEvent) {
    if (event && event.pageSize) {
        this.limit = event.pageSize;
        this.page = event.pageIndex + 1;
        this.listing(this.limit, this.page);
    }
}

}

// Interface for Staff data model
export interface Staff {
  id: number;
  name: string;
  createAt: string;
  updateAt: string;
}
