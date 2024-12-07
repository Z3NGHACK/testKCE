import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { ResponseData } from './transation.type';

@Injectable({
    providedIn: 'root'
})


export class TransactionService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listing(): Observable<ResponseData> {
        return this._httpClient.get<ResponseData>(`${this._url}/general-manager/reports/transaction`);
    }

}


