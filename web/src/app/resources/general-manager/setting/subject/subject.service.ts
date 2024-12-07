import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable, of, tap, catchError} from 'rxjs';
import { SubjectCreateRequest } from './subject.type';
import { Subject } from './subject.type';
@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private _url: string = env.API_BASE_URL;
    

    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'withCredentials': 'true',
        })
    };
    constructor(private _http: HttpClient) { }
  
  // =========================================================================================
  // Listing Subjects (Example of GET request with query params)
  listing(params: { limit?: number; page?: number }): Observable<any> {
    const queryParams: any = {};

    // Add pagination params if provided
    if (params.limit) {
        queryParams.limit = params.limit;
    }

    if (params.page) {
        queryParams.page = params.page;
    }

    return this._http.get<any>(`${this._url}/general-manager/settings/language`, {
      ...this.httpOptions,
      params: queryParams, // Pass queryParams as the query parameters
    }).pipe(
      catchError((error) => {
        console.error('listing failed:', error);
        throw error;
      })
    );
}

  getScoreCategory(): Observable<any> {
    return this._http.get<any>(`${this._url}/general-manager/settings/language/scorecategory`, {
      ...this.httpOptions,
    })
    
  }

  createSubject(data: any): Observable<any> {
    return this._http.post<any>(`${this._url}/general-manager/settings/language`, data, this.httpOptions)
      .pipe(
        catchError((error) => {
          console.error('createSubject failed:', error);
          throw error;
        })
      );
  }

  createScoreCategory(data: any): Observable<any> {
    return this._http.post<any>(`${this._url}/general-manager/settings/language/scorecategory`, data, this.httpOptions)
      .pipe(
        catchError((error) => {
          console.error('createSubject failed:', error);
          throw error;
        })
      );
  }
  
  // =========================================================================================
  // Deleting a Subject
  deleteSubject(id: number): Observable<any> {
    return this._http.delete<any>(`${this._url}/general-manager/settings/language/${id}`, this.httpOptions)
      .pipe(
        tap(_ => console.log(`deleted subject id=${id}`)),
        catchError(this.handleError<any>('deleteSubject'))
      );
  }

  deleteScoreCategory(id: number): Observable<any> {
    return this._http.delete<any>(`${this._url}/general-manager/settings/language/scorecategory/${id}`, this.httpOptions)
      .pipe(
        tap(_ => console.log(`deleted subject id=${id}`)),
        catchError(this.handleError<any>('deleteSubject'))
      );
  }

  // =========================================================================================
  // Update Subject (If there is an update endpoint)
  updateSubject(id: number, data: any): Observable<any> {
    return this._http.put<any>(`${this._url}/general-manager/settings/language/${id}`, data)
  }

  updateScoreCategory(id: number, data: any): Observable<any> {
    return this._http.put<any>(`${this._url}/general-manager/settings/language/scorecategory/${id}`, data)
  }


  view(id: number): Observable<any> {
    return this._http.get(`${this._url}/general-manager/settings/language/${id}`)
  }
  saveNewRate(rate: any, id: number): Observable<any> {
    return this._http.post(`${this._url}/general-manager/settings/language/${id}/rate`, rate);
  }

  updateNewRate(rate: any, subjectID: number, id: number ): Observable<any> {
    return this._http.put(`${this._url}/general-manager/settings/language/${subjectID}/rates/${id}`, rate);
  }

  updateNewSubject(body: any, subjectID: number, id: number ): Observable<any> {
    return this._http.put(`${this._url}/general-manager/settings/language/${subjectID}/subjects/${id}`, body);
  }
  
  createEachSubject(body: any, id: number): Observable<any> {
    return this._http.post(`${this._url}/general-manager/settings/language/${id}/subject`, body);
  }
  

  
  // Service method to fetch the list of rates
  // getRates(): Observable<any> {
  //   return this.http.get<any>(`${this._url}/general-manager/settings/language/rate`);
  // }
  deleteRate(id: number, subjectID: number): Observable<any> {
    return this._http.delete(`${this._url}/general-manager/settings/language/${subjectID}/rates/${id}`);
  }

  deleteEachSubject(id: number , subjectID : number): Observable<any> {
    return this._http.delete<any>(`${this._url}/general-manager/settings/language/${subjectID}/subjects/${id}`);
  }

  // =========================================================================================
  // Error Handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

