import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable, of, tap, catchError, BehaviorSubject } from 'rxjs';
import { SchoolData } from './program.interface';
@Injectable({
    providedIn: 'root'
})
export class ProgramService {
    private _url: string = env.API_BASE_URL;
    private programSubject = new BehaviorSubject<Program.IData>(null);
    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'withCredentials': 'true',
        })
    };
    constructor(private _http: HttpClient) { }
    // ================================================================================>> listing Program api
    listing(params: { limit: number, page: number, key?: string }): Observable<any> {

        const httpOptions = {};
        httpOptions['params'] = params;

        return this._http.get<any>(this._url + '/general-manager/programs', httpOptions);
    }

    view(id: number): Observable<SchoolData> {
        return this._http.get<SchoolData>(this._url + `/general-manager/programs/${id}`);
    }
    setupCreate(): Observable<any> {
        return this._http.get<any>(this._url + `/general-manager/programs/setup`);
    }
    setupAcademic(): Observable<any> {
        return this._http.get<any>(this._url + `/general-manager/programs/setup/academic`);
    }

    setupLevel(): Observable<any> {
        return this._http.get<any>(this._url + `/general-manager/programs/setup/level`);
    }

    setupLanguage(): Observable<any> {
        return this._http.get<any>(this._url + `/general-manager/programs/setup/languages`);
    }


    setupScoreSubject(): Observable<any> {
        return this._http.get<any>(this._url + `/general-manager/programs/1/setup/score-category`);
    }

    setupSubject(id: number): Observable<any> {
        return this._http.get<any>(this._url + `/general-manager/programs/setup/subject/language/${id}`);
    }

    createGrade(body: any): Observable<any> {
        return this._http.post<any>(`${this._url}/general-manager/programs/grade`, body);
    }

    createLanguage(body: any): Observable<any> {
        return this._http.post<any>(`${this._url}/general-manager/programs/language`, body);
    }
    updatePriceLanguage(body: any): Observable<any> {
        return this._http.put<any>(`${this._url}/general-manager/programs/language`, body);
    }

    createSubject(body: any): Observable<any> {
        return this._http.post<any>(`${this._url}/general-manager/programs/subject`, body);
    }

    createSubjectCategory(body: any): Observable<any> {
        return this._http.post<any>(`${this._url}/general-manager/programs/grade-score`, body);
    }

    udpateProgram(id: number, body: any): Observable<any> {
        return this._http.put<any>(this._url + `/general-manager/programs/${id}`, body);
    }
    viewLanguage(id: number, l_id: number): Observable<any> {
        return this._http.get<any>(this._url + `/general-manager/programs/language/${id}/view/${l_id}`);
    }
    updateScoreCategory(grade_id: number, id: number, body: any): Observable<any> {
        return this._http.put<any>(this._url + `/general-manager/programs/${grade_id}/grade-score/${id}`, body);
    }

    deleteProgram(id: number): Observable<any> {
        return this._http.delete<any>(this._url + `/general-manager/programs/${id}`);
    }

    deleteSubject(id: number): Observable<any> {
        return this._http.delete<any>(`${this._url}/general-manager/programs/subject/${id}`);
    }

    deleteLanguage(id: number, l_id: number): Observable<any> {
        return this._http.delete<any>(this._url + `/general-manager/programs/language/${id}/delete/${l_id}`);
    }
    deleteScoreCategory(id: number): Observable<any> {
        return this._http.delete<any>(`${this._url}/general-manager/programs/grade-score/${id}`);
    }
    getProgram(): Observable<Program.IData> {
        return this.programSubject.asObservable();
    }
    setProgram(newProgram: Program.IData): void {
        this.programSubject.next(newProgram);
    }

}
export namespace Program {
    export interface IData {
        general: IGeneral;
        subjects: ISubjects;
        payments: IPayment[];
    }

    export interface IGeneral {
        id: number;
        name: string;
        level_id: number;
        level: string;
        price_per_year: string;
        languages: IStepElement[];
        total_price: number;
        total_subjects: number;
        grade_scores: IGradeScore[];
    }

    export interface IGradeScore {
        grade_score_id: number;
        category_name: string;
        percentage: string;
        created_at: Date;
        status: boolean;
    }

    export interface IStepElement {
        id: number;
        name: string;
        created_at: Date;
        price: string;
        n_subjects?: number;
    }

    export interface IPayment {
        language: IPurpleLanguage;
        steps: IStepElement[];
        discounts: IDiscount[];
    }

    export interface IDiscount {
        id: number;
        percentage: string;
        created_at: Date;
        updated_at: Date;
        prices: string[];
    }

    export interface IPurpleLanguage {
        id: number;
        name: string;
    }

    export interface ISubjects {
        languages: ISubjectsLanguage[];
    }

    export interface ISubjectsLanguage {
        id: number;
        language_grade_id: number;
        name: string;
        created_at: Date;
        subjects: any[];
    }

}
