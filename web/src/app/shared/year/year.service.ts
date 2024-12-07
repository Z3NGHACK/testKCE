import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListingStudent, View } from 'app/resources/principal/year/academic.type';
import { env } from 'envs/env';
import { Observable, of, tap, catchError } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SharedAcademicService {
    private _url: string = env.API_BASE_URL;
    
    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'withCredentials': 'true',
        })
    };
    constructor(private _http: HttpClient) { }


    // ================================================================================>> listing_acedemic api
    listing(params: { limit: number, page: number, key?: string }): Observable<any> {

        const httpOptions = {};
        httpOptions['params'] = params;

        return this._http.get<any>(this._url + '/general-manager/academics', httpOptions);
    }

    view( path: 'principal' | 'general-manager' ,id: number): Observable<View> {
        return this._http.get<View>( `${this._url}/${path}/academics/${id}`);
    }

    create(body: any): Observable<any> {
        return this._http.post<any>(`${this._url}/general-manager/academics`, body);
    }

    update( path: 'principal' | 'general-manager' ,  body: any , id: number): Observable<any> {
        return this._http.put<any>(`${this._url}/${path}/academics/${id}`, body);
    }

    listingStudent( path: 'principal' | 'general-manager' ,  id: number, params: { limit: number, page: number, key?: string, levelid: number }): Observable<ListingStudent> {
        return this._http.get<ListingStudent>(`${this._url}/${path}/academics/${id}/listing/students`, { params: params});
    }

    delete(id: number): Observable<any> {
        return this._http.delete<any>(this._url + `/general-manager/academics/${id}`);
    }
}