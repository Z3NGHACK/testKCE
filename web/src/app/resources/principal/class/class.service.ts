import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { AcademicsResponse, Detail, Listing } from './classroom.type';

@Injectable({
    providedIn: 'root',
})
export class ClassroomService {
    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) {}

    listing(
        params: { key?: string,  academic?: number , levelid?: number , 
                   roomid?: number , gradeid?: number , scheduleid?: number }):
        Observable<Listing> {
            return this._httpClient.get<Listing>(
                `${this._url}/principal/class-rooms`,
                { params: params }
            );
    }

    setup(): Observable<AcademicsResponse> {
        return this._httpClient.get<AcademicsResponse>(
            `${this._url}/principal/class-rooms/data-setup`
        );
    }

    view(id: number): Observable<Detail> {
        return this._httpClient.get<Detail>(
            `${this._url}/principal/class-rooms/${id}`
        );
    }
    Schedulesetup(): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/principal/class-rooms/setup`
        );
    }
    Studentesetup(id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/principal/class-rooms/${id}/student/setup`
        );
    }
    createSchedule(id: number, body: any): Observable<any> {
        return this._httpClient.post<any>(
            `${this._url}/principal/class-rooms/${id}/schedule`,
            body
        );
    }

    createClassroom(body: any): Observable<any> {
        return this._httpClient.post<any>(
            `${this._url}/principal/class-rooms`,
            body
        );
    }
    deleteCalender(id: number): Observable<any> {
        return this._httpClient.delete(
            `${this._url}/principal/class-rooms/schedule/${id}`
        );
    }

    datilShift(id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/principal/class-rooms/shift/${id}`
        );
    }

    datilStudent(id: number, student_id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/principal/class-rooms/${id}/student/${student_id}`
        );
    }

    monthlyReport(
        id: number,
        sub_id: number,
        student_id: number,
        params: { mon_id: number }
    ): Observable<any> {
        return this._httpClient.get(
            `${this._url}/principal/class-rooms/${id}/subject_score/${sub_id}/student/${student_id}`,
            { params: params }
        );
    }

    getreports(id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/principal/class-rooms/reports/${id}`
        );
    }

    datilReport(id: number, mon_id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/principal/class-rooms/${id}/month/${mon_id}`
        );
    }
    addStudent(id: number, student_ids: number[]): Observable<any> {
        return this._httpClient.post<any>(
            `${this._url}/principal/class-rooms/${id}/add_student`,
            { student_ids }
        );
    }

    reportBymonth(
        id: number,
        student_id: number,
        params: { mon_id: number }
    ): Observable<any> {
        return this._httpClient.get(
            `${this._url}/principal/class-rooms/${id}/report_month/${student_id}`,
            { params: params }
        );
    }
}
