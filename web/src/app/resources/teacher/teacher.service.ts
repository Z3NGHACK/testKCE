import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { Listing } from '../general-manager/branch/branch.type';

@Injectable({
    providedIn: 'root',
})
export class TeacherService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }
    getDashboard(params: { level_id: number }): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/teacher/dashboard`, {
            params: params,
        });
    }

    listing(params: {
        academic_id: number;
    }): Observable<Listing> {
        return this._httpClient.get<Listing>(
            `${this._url}/teacher/class-rooms`,
            { params: params }
        );
    }
    setup(): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/teacher/class-rooms/setup`
        );
    }
    view(id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/teacher/class-rooms/${id}`
        );
    }
    datilShift(id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/teacher/class-rooms/shift/${id}`
        );
    }
    updateAttechment(id: number, body: any) {
        return this._httpClient.patch(
            `${this._url}/teacher/class-rooms/shift/attendent/${id}`,
            body
        );

    }
    datilStudent(id: number, student_id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/teacher/class-rooms/${id}/student/${student_id}`
        );
    }
    reportBymonth(
        id: number,
        student_id: number,
        params: { mon_id: number }
    ): Observable<any> {
        return this._httpClient.get(
            `${this._url}/teacher/class-rooms/${id}/report_month/${student_id}`,
            { params: params }
        );
    }
    monthlyReport(
        id: number,
        sub_id: number,
        student_id: number,
        params: { mon_id: number }
    ): Observable<any> {
        return this._httpClient.get(
            `${this._url}/teacher/class-rooms/${id}/subject_score/${sub_id}/student/${student_id}`,
            { params: params }
        );
    }
    createScore(id: number, body: any): Observable<any> {
        return this._httpClient.post(
            `${this._url}/teacher/class-rooms/${id}/subject_score`,
            body
        );
    }
    createShift(id: number, body: any): Observable<any> {
        return this._httpClient.post(
            `${this._url}/teacher/class-rooms/${id}/shift`,
            body
        );
    }
    getSetup(id: number): Observable<any> {
        return this._httpClient.get(
            `${this._url}/teacher/class-rooms/${id}/shift/setup`
        );
    }

    // report
    getreports(id: number): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/teacher/reports/${id}`);
    }
    datilReport(id: number, mon_id: number): Observable<any> {
        return this._httpClient.get<any>(
            `${this._url}/teacher/reports/${id}/month/${mon_id}`
        );
    }


    // calender
    getCalender(params: { year: number; month: number }): Observable<any> {
        return this._httpClient.get<any>(`${this._url}/teacher/schedules`, {
            params: params,
        });
    }
    getCalenderSetup(): Observable<any> {
        return this._httpClient.get(`${this._url}/teacher/schedules/setup`);
    }
    deleteCalender(id: number): Observable<any> {
        return this._httpClient.delete(
            `${this._url}/teacher/class-rooms/schedule/${id}`
        );
    }
    // Schedulesetup(): Observable<any> {
    //     return this._httpClient.get<any>(
    //         `${this._url}/principal/class-rooms/setup`
    //     );
    // }
}
