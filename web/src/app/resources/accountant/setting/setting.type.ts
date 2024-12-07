import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

// Modify the interface to match the JSON structure
export interface Listing extends Pagination {
    data: Bank[];
    exchange: Exchange[];
}

export interface Bank {
    id: number;
    name: string;
    icon: string;
    qr_icon: string;
    account_name: string;
    account_number: number;
    created_at: string | Date;
    updated_at: string | Date;
}


export interface Exchange {
    id: number;
    code: string;
    number: string;
    created_at: Date;  // Using Date for timestamp fields
    updated_at: Date;
}