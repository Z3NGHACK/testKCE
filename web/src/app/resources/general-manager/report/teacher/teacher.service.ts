import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';
import { TeacherStatistics } from './teacher.type';

@Injectable({
    providedIn: 'root'
})


export class ReportTeacherService {

    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) { }

    listing(): Observable<TeacherStatistics> {
        return this._httpClient.get<TeacherStatistics>(`${this._url}/general-manager/reports/teacher`);
    }

}


