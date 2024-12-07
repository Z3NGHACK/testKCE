import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { Listing , Teacher, View } from './teacher.types';
import { Detail } from 'app/resources/principal/class/classroom.type';

@Injectable({
    providedIn: 'root'
})


export class SharedTeacherService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listing(path: 'principal' | 'general-manager' , params: { limit: number, page: number, key?: string  }): Observable<Listing> {
        return this._httpClient.get<Listing>(`${this._url}/${path}/teachers`, { params: params });
    }

    view(path: 'principal' | 'general-manager', id: number): Observable<View> {
        return this._httpClient.get<View>(`${this._url}/${path}/teachers/${id}`);
    }

    updateTeacher(path: 'principal' | 'general-manager', id: number , body: any): Observable<any> {
        return this._httpClient.put<any>(`${this._url}/${path}/teachers/${id}`, body);
    }

    viewClassroom(path: 'principal' | 'general-manager', id:number): Observable<Detail> {
        return this._httpClient.get<Detail>(`${this._url}/${path}/teachers/classroom/${id}`);
    }

    datilStudent(path: 'principal' | 'general-manager',id: number, student_id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/${path}/teachers/classroom/${id}/student/${student_id}`
        );
    }

    reportBymonth(
        path: 'principal' | 'general-manager',
        id: number,
        student_id: number,
        params: { mon_id: number }
    ): Observable<any> {
        return this._httpClient.get(
            `${this._url}/${path}/teachers/classroom/${id}/report_month/${student_id}`,
            { params: params }
        );
    }

    monthlyReport(
        path: 'principal' | 'general-manager',
        id: number,
        sub_id: number,
        student_id: number,
        params: { mon_id: number }
    ): Observable<any> {
        return this._httpClient.get(
            `${this._url}/${path}/teachers/classroom/${id}/subject_score/${sub_id}/student/${student_id}`,
            { params: params }
        );
    }

    datilShift(path: 'principal' | 'general-manager',id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/${path}/teachers/classroom/shift/${id}`
        );
    }

    getreports(path: 'principal' | 'general-manager' , id: number): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/${path}/teachers/classroom/reports/${id}`);
    }

    Principalgetreports(path: 'principal' | 'general-manager' , id: number): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/${path}/teachers/reports/${id}`);
    }
    
    datilReport(path: 'principal' | 'general-manager' , id: number, mon_id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/${path}/teachers/classroom/${id}/month/${mon_id}`
        );
    }

    getSetupLevel(path: 'principal' | 'general-manager'): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/${path}/teachers/setup/level`);
    }

    getSetupBranch(path: 'principal' | 'general-manager'): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/${path}/teachers/setup/branch`);
    }


    setup(path: 'principal' | 'general-manager'): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/${path}/class-rooms/data-setup`
        );
    }

    Schedulesetup(path: 'principal' | 'general-manager'): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/${path}/class-rooms/setup`
        );
    }

    deleteCalender(id: number): Observable<any> {
        return this._httpClient.delete(
            `${this._url}/principal/class-rooms/schedule/${id}`
        );
    }

    getSetup(path: 'principal' | 'general-manager' ,  id: number): Observable<any> {
        return this._httpClient.get(
            `${this._url}/${path}/class-rooms/${id}/shift/setup`
        );
    }

    ViewScadule(path: 'principal' | 'general-manager', id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/${path}/class-rooms/${id}`
        );
    }

    phonecheck(path: 'principal' | 'general-manager' , params: { phone?: string  }): Observable<any> {
        return this._httpClient.get<Listing>(`${this._url}/${path}/teachers/check-phone`, { params: params });
    }
}


