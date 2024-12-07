import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

// Modify the interface to match the JSON structure
export interface Listing extends Pagination {
    data: Invoice[]
}

export interface Invoice {
    id: number;
    code: string;
    total_price: string; 
    receiver_name: string;
    created_at: string | Date;
    status: string;
}


export interface InvoiceDetail {
    id: number;
    code: string;
    total_price: string; 
    receiver_name: string;
    created_at: string | Date;
    status: {
        name: string;
    };
    academic_languages: {
        student_id: number;
        student_language: {
            discount: string;
            price: string;
            step: {
                name: string;
            };
        }[];
        student: {
            kh_name: string;
            parents: {
                name: string;
            }[];
        };
    };
    other_payments: {
        price: string;
        discount: string;
        note: string;
        income_name: string;
    }[];
   
}