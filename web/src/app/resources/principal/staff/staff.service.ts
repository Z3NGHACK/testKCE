import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { General, Listing , View } from './staff.type';

@Injectable({
    providedIn: 'root'
})


export class StaffService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listing(params: { limit: number, page: number, key?: string , roleid?: number}): Observable<Listing> {
        return this._httpClient.get<Listing>(`${this._url}/principal/staffs`, { params: params });
    }

    view( id: number): Observable<View> {
        return this._httpClient.get<View>(`${this._url}/principal/staffs/${id}`);
    }

    getSetup(): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/principal/staffs/setup/role`);
    }

    updateStaff(id: number , body: any): Observable<View> {
        return this._httpClient.put<View>(`${this._url}/principal/staffs/${id}`, body);
    }

    createStaff(body: any): Observable<any> {
        return this._httpClient.post<any>(`${this._url}/principal/staffs/create`, body);
    }

    updatePassword(id: number , body: any): Observable<any[]> {
        return this._httpClient.put<any[]>(`${this._url}/principal/staffs/change-password/${id}`, body);
    }
}


