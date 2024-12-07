import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { SharedTeacherService } from 'app/shared/teacher/teacher.service';
import { PortraitComponent } from 'helper/components/portrait/portrait.component';
import { GlobalConstants } from 'helper/shared/constants';
import { env } from 'envs/env';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { ProfileService } from './profile.service';
import { ProfileUpdateComponent } from './update/update.component';
import { ProfileChangePasswordComponent } from './change-password/change-password.component';

@Component({
    selector: 'account-profile',
    standalone: true,
    imports: [
        MatTabsModule,
        MatIconModule,
        PortraitComponent,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDialogModule,
        CommonModule,
        FormsModule,
        MatTableModule,
        MatExpansionModule,
        MatRadioModule,
        MatMenuModule,
        MatInputModule,
        ReactiveFormsModule,
        MatCheckboxModule,],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {

    public data: any;
 
    fileUrl: string = env.FILE_BASE_URL;
    constructor(
      
        private _matDialog: MatDialog,
        private _snackbarService: SnackbarService,
        private _service: ProfileService,
      ) {
  
    }
    ngOnInit(): void {  
    //    this.viewdetail(this.data);
        this.view();
    }
    
    view(): void {
        this._service.listing().subscribe({
        next: res => {
            this.data= res.data; 
            console.log(this.data)
        },
        error: err => {
            this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
        }
        
        });
    }

    changePassword(row: any): void {
        const dialogConfig = new MatDialogConfig();
    
        // Pass the selected row data to the dialog
        dialogConfig.data = row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef: MatDialogRef<ProfileChangePasswordComponent> = this._matDialog.open(ProfileChangePasswordComponent, dialogConfig);
    
    }
    


    update(row: any): void {
        const dialogConfig = new MatDialogConfig();
    
        // Pass the selected row data to the dialog
        dialogConfig.data = row;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef: MatDialogRef<ProfileUpdateComponent> = this._matDialog.open(ProfileUpdateComponent, dialogConfig);
    
        // Handle dialog close event
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Update the data object with the new values from result
                this.data.avatar = result.avatar;
                this.data.name = result.name;
                this.data.phone = result.phone;
                this.data.email = result.email;
                this.data.dob = result.dob;
                this.data.address = result.address;
                this.data.created_at = result.created_at;
                this.data.sex_id = result.sex_id;
                this.data.sex = result.sex;
            }
        });
    }
    
    formatPhoneNumber(phone) {
        // Ensure the phone number is a string and remove any non-digit characters
        const cleaned = ('' + phone).replace(/\D/g, '');
    
        // Add a space after every 3 digits
        return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ');
    }
}
