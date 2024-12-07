
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { Listing } from './setting.type';

@Injectable({
    providedIn: 'root'
})


export class SettingService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listingBank(): Observable<Listing> {
        return this._httpClient.get<Listing>(`${this._url}/accountant/settings/bank`);
    }

    updateBank(id: number , body: any): Observable<any> {
        return this._httpClient.put<any>(`${this._url}/accountant/settings/bank/${id}`, body);
    }

    deleteBank(id: number): Observable<any> {
        return this._httpClient.delete<any>(`${this._url}/accountant/settings/bank/${id}`);
    }

    createbank( body: any): Observable<any> {
        return this._httpClient.post<any>(`${this._url}/accountant/settings/bank`, body);
    }
    
    
    updateExchange(id: number , body: any): Observable<any> {
        return this._httpClient.put<any>(`${this._url}/accountant/settings/exchange/${id}`, body);
    }


    
  
}

