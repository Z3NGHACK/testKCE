import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable, of, tap, catchError } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SourceService {
    private _url: string = env.API_BASE_URL;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'withCredentials': 'true',
        })
    };
    constructor(private _http: HttpClient) { }
  
    listing(params: { limit: number, page: number, key?: string }): Observable<any> {

        const httpOptions = {};
        httpOptions['params'] = params;

        return this._http.get<any>(this._url + '/general-manager/settings/income', httpOptions);
    }

    create(body: any): Observable<any> {
        return this._http.post<any>(`${this._url}/general-manager/settings/income`, body);
    }

    update(id: number, body : any): Observable<any> {
        return this._http.put<any>(`${this._url}/general-manager/settings/income/${id}`, body);
    }

    delete(id: number): Observable<any> {
        return this._http.delete<any>(`${this._url}/general-manager/settings/income/${id}`);
    }
}