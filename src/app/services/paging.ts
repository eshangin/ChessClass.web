import { Params } from "@angular/router";
import { Injectable } from "@angular/core";

export interface IPagingRequest {
    page?: number;
    count?: number;
}

export interface IPaging<T> {
    page: number;
    totalPages: number;
    totalRecords: number;
    items: T[];
}

@Injectable({
    providedIn: 'root'
})
export class PagingHelper {
    setPagingParams(params: Params, request: IPagingRequest) {
        request = request || {};
        if (request.count) {
            params['count'] = request.count;
        }
        if (request.page) {
            params['page'] = request.page;
        }
    }
}