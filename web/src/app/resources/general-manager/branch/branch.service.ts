import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable, of, tap, catchError } from 'rxjs';
import { BranchCreateRequest, Listing, MainData } from './branch.type';
import { ListingInvoice, View } from 'app/shared/payment/payment.type';
@Injectable({
    providedIn: 'root'
})
export class BranchService {
    private _url: string = env.API_BASE_URL;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'withCredentials': 'true',
        })
    };
    constructor(private _http: HttpClient) { }
  
    // ================================================================================>> listing_teacher api
    listing(params: { limit: number, page: number, key?: string }): Observable<Listing> {

        const httpOptions = {};
        httpOptions['params'] = params;

        return this._http.get<Listing>(this._url + '/general-manager/branches', httpOptions);
    }

    createBranch(data: BranchCreateRequest): Observable<BranchCreateRequest> {
        return this._http.post<BranchCreateRequest>(this._url + '/general-manager/branches', data);
    }

    updateBranch(data: BranchCreateRequest, id: number): Observable<BranchCreateRequest> {
        return this._http.put<BranchCreateRequest>(this._url + '/general-manager/branches/' + id , data);
    }

    deleteBranch(id: number): Observable<any> {
        return this._http.delete<any>(`${this._url}/general-manager/branches/${id}`);
    }

    view(id: number , params: { month?: string , income_month?: string , primary_income_month?: string}): Observable<MainData> {
        return this._http.get<MainData>(`${this._url}/general-manager/branches/${id}` ,  { params: params });
    }

    viewPayment(id:number): Observable<View> {
        return this._http.get<View>(`${this._url}/general-manager/branches/payments/${id}`);
    }
    
    viewUser(path: 'teacher' | 'staff' | 'student',id:number): Observable<View> {
        return this._http.get<View>(`${this._url}/general-manager/branches/${path}/${id}`);
    }

    listingBranch(id:number, params: { limit: number, page: number, key?: string }): Observable<ListingInvoice> {
        return this._http.get<ListingInvoice>(`${this._url}/general-manager/branches/${id}/payments`, { params: params });
    }

    viewClassroom(id:number): Observable<any> {
        return this._http.get<any>(`${this._url}/general-manager/branches/teacher/classroom/${id}`);
    }

    getStatusSetup(): Observable<any> {
        return this._http.get<any>(`${this._url}/general-manager/branches/setup/status`);
    }


}