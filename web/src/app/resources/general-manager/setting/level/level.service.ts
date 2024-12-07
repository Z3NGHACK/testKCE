import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable, of, tap, catchError } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class LevelService {
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

        return this._http.get<any>(this._url + '/general-manager/settings/level', httpOptions);
    }

    create(body: any): Observable<any> {
        return this._http.post<any>(`${this._url}/general-manager/settings/level`, body);
    }

    update(id: number, body : any): Observable<any> {
        return this._http.put<any>(`${this._url}/general-manager/settings/level/${id}`, body);
    }

    delete(id: number): Observable<any> {
        return this._http.delete<any>(`${this._url}/general-manager/settings/level/${id}`);
    }
    // createLevel(data: any): Observable<any> {
    //     return this.http.post<any>(`${this._url}/general-manager/settings/level`, data, this.httpOptions)
    //       .pipe(
    //         catchError((error) => {
    //           console.error('createSubject failed:', error);
    //           throw error;
    //         })
    //       );
    //   }
    //   deleteLevel(id: number): Observable<any> {
    //     return this.http.delete<any>(`${this._url}/general-manager/settings/language/${id}`, this.httpOptions)
    //       .pipe(
    //         tap(_ => console.log(`deleted subject id=${id}`)),
    //         catchError(this.handleError<any>('deleteSubject'))
    //       );
    //   }
        // =========================================================================================
  // Error Handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}