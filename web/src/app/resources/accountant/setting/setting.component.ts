import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SettingService } from './setting.service';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'helper/services/snack-bar/snack-bar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Bank, Exchange } from './setting.type';
import { env } from 'envs/env';
import { GlobalConstants } from 'helper/shared/constants';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BankDetailsComponent } from './view/view.component';
import { CreateBankComponent } from './create/create.component';
import { UpdateBankComponent } from './update/update.component';
import { UpdateExchangeComponent } from './update-exchange/update-exchange.component';
@Component({
    selector: 'accountant-setting',
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatMenuModule,
        MatMenuTrigger,
        CommonModule
    ],
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss'
})
export class SettingComponent {
    public data: Bank[] = [];
    public exchange: Exchange[]= [];
    public displayedColumns: string[] = ['bank', 'user', 'account', 'date', 'action'];
    public dataSource: MatTableDataSource<Bank> = new MatTableDataSource<Bank>([]);
    isLoading: boolean = false;
    key: string = '';
    page: number = 1;
    limit: number = 15;
    total: number = 0;
    path: 'receptionist' | 'general-manager';
    fileUrl: string = env.FILE_BASE_URL;
    branch_id: number = 0;
    branches: { id: number, name: string }[] = [];

    constructor(
        private _settingsService: SettingService,
        private _activatedRoute: ActivatedRoute,
        private _snackbarService: SnackbarService,
        private _matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.listing(this.limit, this.page);
    }

 
    listing(_limit: number = 15, _page: number = 1): void {
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
        this.isLoading = true;
        this._settingsService.listingBank().subscribe({
            next: res => {
                this.data = res.data;
                this.exchange = res.exchange;
                this.dataSource.data = this.data;
                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }


    delete(item: Bank): void {
        this._settingsService.deleteBank(item.id).subscribe({
            next: res => {
                this.listing();
                this._snackbarService.openSnackBar("ការលុបទទួលបានជោគជ័យ"|| GlobalConstants.genericError, GlobalConstants.error);
                
            },
            error: err => {
                this.isLoading = false;
                this._snackbarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }


    viewdetail(row: Bank): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { row };
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef: MatDialogRef<BankDetailsComponent> = this._matDialog.open(BankDetailsComponent, dialogConfig);
    
        dialogRef.componentInstance.updateData.subscribe(result => {
            this.listing();
        });
    }

    create(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef: MatDialogRef<CreateBankComponent> = this._matDialog.open(CreateBankComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(() => {
            this.listing();
        });
    }

    udpateExchange(item: Exchange): void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.data = item;
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        dialogConfig.autoFocus = false;
    
        const dialogRef: MatDialogRef<UpdateExchangeComponent> = this._matDialog.open(UpdateExchangeComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(() => {
            this.listing();
        });
    }
}
