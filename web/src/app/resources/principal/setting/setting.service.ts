import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'envs/env';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SettingService {
    private _url: string = env.API_BASE_URL;

    constructor(private _httpClient: HttpClient) {}

    createRoom(body: {
        name: string;
        building_name: string;
        floor: number;
        description: string;
    }): Observable<any> {
        return this._httpClient.post(
            `${this._url}/principal/settings/class-room`,
            body
        );
    }
    updateRoom(
        id: number,
        body: {
            name: string;
            building_name: string;
            floor: number;
            description: string;
        }
    ): Observable<any> {
        return this._httpClient.patch(
            `${this._url}/principal/settings/class-room/${id}`,
            body
        );
    }
    deleteRoom(id: number): Observable<any> {
        return this._httpClient.delete(
            `${this._url}/principal/settings/class-room/${id}`
        );
    }
    listing(params: {
        limit: number;
        page: number;
        key?: string;
    }): Observable<any> {
        const httpOptions = {};
        httpOptions['params'] = params;

        return this._httpClient.get<any>(
            this._url + '/principal/settings/class-room',
            httpOptions
        );
    }
}
