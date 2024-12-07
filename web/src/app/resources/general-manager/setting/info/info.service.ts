import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable, of, tap, catchError, map, throwError } from 'rxjs';
import { Staff } from './info.component';


@Injectable({
    providedIn: 'root'
})
export class InfoService {
    private _url: string = env.API_BASE_URL;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'withCredentials': 'true',
        })
    };
    constructor(private _http: HttpClient) { }
    
    listingStaff(params: { limit: number, page: number, key?: string }): Observable<any> {

        const httpOptions = {};
        httpOptions['params'] = params;

        return this._http.get<any>(this._url + '/general-manager/settings/info/1/staffs', httpOptions);
    }
    

    openEditModal() {
        document.getElementById("editModal").style.display = "block";
    }
    
    closeEditModal() {
        document.getElementById("editModal").style.display = "none";
    }

    // In your InfoService
saveNewStaff(newStaff: Staff): Observable<any> {
    return this._http.post<any>(`${this._url}/staff`, newStaff, this.httpOptions).pipe(
      catchError((error: any) => {
        console.error('Error saving new staff:', error);
        throw error;
      })
    );
  }
  
     // Function to fetch school data
    getSchoolInfo(): Observable<any> {
      // Use httpOptions similar to listing, or pass directly if there are no params
      return this._http.get<any>(this._url + '/general-manager/settings/info/1', this.httpOptions)

    }   
    createStaff(body: any): Observable<any> {
        // Use httpOptions similar to listing, or pass directly if there are no params
        return this._http.post<any>(`${this._url}/general-manager/settings/info/1/staffs`, body)
  
    }   
    


    updateStaff(body: any, id:number): Observable<any> {
        // Use httpOptions similar to listing, or pass directly if there are no params
        return this._http.put<any>(`${this._url}/general-manager/settings/info/1/staffs/${id}`, body)
  
    }   

    updatePassword(body: any, id:number): Observable<any> {
        // Use httpOptions similar to listing, or pass directly if there are no params
        return this._http.put<any>(`${this._url}/general-manager/settings/info/1/staffs/change-password/${id}`, body)
  
    }   



    updateSchoolInfo(body: any): Observable<any> {
        // Use httpOptions similar to listing, or pass directly if there are no params
        return this._http.put<any>(this._url + '/general-manager/settings/info/1', body)
  
    }   
  
    getStaffData(): Observable<any> {
        return this._http
        .get<any>(`${this._url}/general-manager/settings/info/staffs`, this.httpOptions) // Adjust the URL as needed
        .pipe(
            map((response: any) => response),
            catchError((error: any) => {
            console.error('Error fetching staff data:', error);
            return throwError(error);
            })
        );
    }

    getSetup(): Observable<any> {
        return this._http.get<any>(this._url + '/general-manager/settings/info/1/staffs/setup/branch', this.httpOptions)

    } 

    deleteStaff(id: number): Observable<any> {
        // Use httpOptions similar to listing, or pass directly if there are no params
        return this._http.delete<any>(`${this._url}/general-manager/settings/info/1/staffs/${id}`)
    }   

}