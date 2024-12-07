import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable, of, tap, catchError, ReplaySubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ReceptionistService {
    private url: string = env.API_BASE_URL;
    private file: string = env.FILE_BASE_URL;
    private _viewstudent: ReplaySubject<any> = new ReplaySubject<any>(1);


    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'withCredentials': 'true',
        })
    };
    constructor(private http: HttpClient) { }



    // ================================================================================>> listing_student api
    listing_student(params: { limit: number, page: number, key?: string }): Observable<any> {

        const httpOptions = {};
        httpOptions['params'] = params;

        return this.http.get<any>(this.url + '/receptionist/students', httpOptions);
    }

    setUpPriceLanguage(params: { grade_id: number, language_id: number}): Observable<any> {

        const httpOptions = {};
        httpOptions['params'] = params;

        return this.http.get<any>(this.url + '/receptionist/students/setup-price', httpOptions);
    }

    setup(params = {}): any {
        const httpOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        };
        httpOptions['params'] = params;
        return this.http.get(this.url + '/receptionist/students/setup-data', httpOptions);
    }


    checkPhoneAndEmail(body: { phone1: string, name:string, job: string, email?: string, phone2?: string}): Observable<{ statusCode: number, parentId: any, message: string }> {

        return this.http.post<{ statusCode: number, parentId: any, message: string }>(this.url + `/receptionist/students/check`, body);
    }
    addParent(id:number,body: any): Observable<{ statusCode: number, parent: any, message: string }> {

        return this.http.post<{ statusCode: number, parent: any, message: string }>(this.url + `/receptionist/students/parent/${id}`, body);
    }

    createStudent(body: any): Observable<{ statusCode: number, message: string }> {
        return this.http.post<{ statusCode: number, message: string }>(this.url + `/receptionist/students`, body);
    }
    getDashboard() {
        return this.http.get(this.url + `/receptionist/dashboard`);
    }
    datilStudent( id:number,student_id:number): Observable<any> {
        return this.http.get<any>(`${this.url}/receptionist/students/${student_id}/class/${id}`);
    }
    set viewStudent(value: any) {
        this._viewstudent.next(value);
    }

    get viewStudent$(): Observable<any> {
        return this._viewstudent.asObservable();
    }
}
