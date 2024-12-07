import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable, of, tap, catchError } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class TeacherService {
    private _url: string = env.API_BASE_URL;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'withCredentials': 'true',
        })
    };
    constructor(private http: HttpClient) { }
  
    // ================================================================================>> listing_teacher api
    listing(params: { limit: number, page: number, key?: string }): Observable<any> {

        const httpOptions = {};
        httpOptions['params'] = params;

        return this.http.get<any>(this._url + '/general-manager/teachers', httpOptions);
    }
}