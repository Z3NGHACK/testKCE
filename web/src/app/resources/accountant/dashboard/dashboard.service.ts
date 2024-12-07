import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';

import { Detail } from 'app/resources/principal/class/classroom.type';
import { DataResponse } from './dashboard.type';

@Injectable({
    providedIn: 'root'
})


export class DashbordService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    view(params: { month?: string , income_month?: string ,primary_income_month?: string}): Observable<DataResponse> {
        return this._httpClient.get<DataResponse>(`${this._url}/accountant/dashboard` , {params: params} );
    }
}