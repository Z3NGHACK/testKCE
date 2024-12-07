import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})


export class ProfileService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listing(): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/account/profile`);
    }

    updateProfile( body: any): Observable<any> {
        return this._httpClient.put<any>(`${this._url}/account/profile`, body);
    }

    updatePassword( body: any): Observable<any> {
        return this._httpClient.put<any>(`${this._url}/account/profile/change-password`, body);
    }

}


