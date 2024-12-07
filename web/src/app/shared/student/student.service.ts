import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { Listing, Parent, View } from './student.types';

@Injectable({
    providedIn: 'root'
})


export class SharedStudentService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listing(path: 'receptionist' | 'general-manager', params: { limit: number, page: number, key?: string }): Observable<Listing> {
        return this._httpClient.get<Listing>(`${this._url}/${path}/students`, { params: params });
    }


    view(path: 'receptionist' | 'general-manager', id: number): Observable<View> {
        return this._httpClient.get<View>(`${this._url}/${path}/students/${id}`);
    }

    createStudent(body: any , id: number): Observable<{ statusCode: number, message: string }> {
        console.log(body)
        return this._httpClient.put<{ statusCode: number, message: string }>(this._url + `/receptionist/students/${id}`, body);
    }

    setup(params = {}): any {
        const httpOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        };
        httpOptions['params'] = params;
        return this._httpClient.get(this._url + '/receptionist/students/setup-data', httpOptions);
    }
    setupFilter(): any {
        const httpOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        };
        return this._httpClient.get(this._url + '/receptionist/students/setup-filter');
    }

    setupPrice(grade_id: number, language_id: number): Observable<any>{
        return this._httpClient.get(this._url+`/receptionist/students/setup-price?grade_id=${grade_id}&language_id=${language_id}`)
    }
    viewInvoice(id: number):any{
        return this._httpClient.get(this._url+`/receptionist/students/invoice/${id}`)
    }
    updateInvoice( id: number): Observable<any> {
        return this._httpClient.put(`${this._url}/receptionist/students/invoice/${id}`,{});
    }

    updateParent(path: 'receptionist' | 'general-manager', id: number , body: Parent): Observable<{message:string,parent:Parent}> {
        return this._httpClient.put<{message:string,parent:Parent}>(`${this._url}/${path}/students/parent/${id}`, body);
    }


    deleteParent(path: 'receptionist' | 'general-manager', id: number ): Observable<any> {
        return this._httpClient.delete<any>(`${this._url}/${path}/students/parent/${id}`);
    }
    attechment(class_id: any, value: any) {
        return this._httpClient.post<any>(`${this._url}/receptionist/students/file/${class_id}`,value);
    }


}


