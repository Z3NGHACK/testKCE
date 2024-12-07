import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable, of, tap, catchError } from 'rxjs';
import { Listing, View } from './academic.type';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
@Injectable({
    providedIn: 'root'
})
export class AcademicService {
    private _url: string = env.API_BASE_URL;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'withCredentials': 'true',
        })
    };
    constructor(private http: HttpClient) { }

 
    // ================================================================================>> listing_academic api
    listing(params: { limit: number, page: number, key?: string }): Observable<Listing> {

        const httpOptions = {};
        httpOptions['params'] = params;

        return this.http.get<Listing>(this._url + '/principal/academics', httpOptions);
    }

    view(id: number): Observable<View> {
        return this.http.get<View>( `${this._url}/principal/academics/${id}`);
    }

    getYearSetup(): Observable<View> {
        return this.http.get<View>( `${this._url}/principal/academics/setup`);
    }

    addYear(body: any): Observable<any>{
        return this.http.post<any>( `${this._url}/principal/academics/add` , body);
    }

}