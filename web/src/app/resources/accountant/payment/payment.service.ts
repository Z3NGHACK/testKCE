import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { InvoiceDetail, Listing } from './payment.type';
import { View } from 'app/shared/payment/payment.type';
@Injectable({
    providedIn: 'root'
})


export class PaymentService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listing(params: { limit: number, page: number, key?: string }): Observable<Listing> {
        return this._httpClient.get<Listing>(`${this._url}/accountant/payments`, { params: params });
    }

    
    view( id:number): Observable<View> {
        return this._httpClient.get<View>(`${this._url}/accountant/payments/${id}`);
    }

}


