import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { InvoiceDetail, Listing, View } from './payment.type';
@Injectable({
    providedIn: 'root'
})


export class SharedPaymentService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listing(path: 'principal' | 'general-manager' | 'accountant', params: { limit: number, page: number, key?: string , statusid?: number}): Observable<Listing> {
        return this._httpClient.get<Listing>(`${this._url}/${path}/payments`, { params: params });
    }

    view(path: 'principal' | 'general-manager' | 'accountant' , id:number): Observable<View> {
        return this._httpClient.get<View>(`${this._url}/${path}/payments/${id}`);
    }
    
    getSetup(path: 'principal' | 'general-manager' | 'accountant'): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/${path}/payments/setup/status`);
    }

    update(path: 'principal' | 'general-manager' | 'accountant' , id:number): Observable<any> {
        return this._httpClient.put(`${this._url}/${path}/payments/invoice/${id}`, {} );
    }

}


