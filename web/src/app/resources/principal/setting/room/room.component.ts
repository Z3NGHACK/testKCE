import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { SettingService } from '../setting.service';
import { CreateRoomComponent } from './create/create.component';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helper/shared/constants';

@Component({
    selector: 'principal-room',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        RouterLink,
        MatTooltipModule,
    ],
    templateUrl: './room.component.html',
    styleUrl: './room.component.scss',
})
export class SettingRoomComponent {
    displayedColumns: string[] = ['number', 'date', 'n_of_class', 'action'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([
        {
            id: 0,
            name: '',
            code: '',
            avatar: '',
            sex: '',
            branch: '',
            class: '',
            created_at: '',
        },
    ]);
    isLoading: boolean = false;
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    constructor(
        private service: SettingService,
        private _matDialog: MatDialog,
        private _snackbarService: SnackbarService
    ) {}
    ngOnInit() {
        this.listing();
    }
    listing(_limit: number = 15, _page: number = 1): void {
        const param: { limit: number; page: number; key?: string } = {
            limit: _limit,
            page: _page,
        };
        param.key = this.key;
        if (this.page != 0) {
            param.page = this.page;
        }
        this.isLoading = true;
        this.service.listing(param).subscribe({
            next: (res) => {
                this.dataSource = new MatTableDataSource(res.data);
                this.total = res.pagination.total_items;
                this.page = res.pagination.current_page;
                this.limit = res.pagination.per_page;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(
                    err?.error?.message || GlobalConstants.genericError,
                    GlobalConstants.error
                );
            },
        });
    }

    onPageChanged(event: PageEvent) {
        if (event && event.pageSize) {
            this.limit = event.pageSize;
            this.page = event.pageIndex + 1;
            this.listing(this.limit, this.page);
        }
    }
    async create(item?: any): Promise<void> {
        let res: any;

        // Proceed to open the dialog with the retrieved data
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { item }; // Pass the data to the dialog
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;

        const dialogRef = this._matDialog.open(
            CreateRoomComponent,
            dialogConfig
        );

        // Handle the dialog result
        dialogRef.afterClosed().subscribe((result) => {
            this.listing();
        });
    }
    delete(item: any) {
        this.service.deleteRoom(item.id).subscribe({
            next: (res) => {
                this.listing();
                this._snackbarService.openSnackBar(
                    res.message,
                    GlobalConstants.success
                );
            },
            error: (err) => {
                let message: string =
                    err.error.message ?? GlobalConstants.genericError;
                this._snackbarService.openSnackBar(
                    message,
                    GlobalConstants.error
                );
            },
        });
    }
}
