import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { FinanceData } from './finance.type';

@Injectable({
    providedIn: 'root'
})


export class FinanceTeacherService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listing(): Observable<FinanceData> {
        return this._httpClient.get<FinanceData>(`${this._url}/general-manager/reports/finance`);
    }

}


