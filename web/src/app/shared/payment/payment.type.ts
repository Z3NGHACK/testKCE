import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

// Modify the interface to match the JSON structure
export interface Listing extends Pagination {
    data: Invoice[]
}

export interface ListingInvoice extends Pagination {
    data: Invoice[]
}

export interface Invoice {
    id: number;
    code: string;
    total_price: string; 
    receiver_name: string;
    created_at: string | Date;
    status: string;
    branch_name: string;
}


export interface View{
    data: InvoiceDetail;
}

export interface InvoiceDetail {
    id: number;                   // e.g., 1
    price: string;                // e.g., "1500"
    code: string;                 // e.g., "#INV/2024/0001"
    created_at: string | Date;    // e.g., "2024-09-13T06:17:03.949Z"
    receiver: {
        id: number;               // e.g., 1
        name: string;             // e.g., "អ៊ុំ គន្ធាល"
        sex_id: number;           // e.g., 1
    };
    student: {
        id: number;               // e.g., 1
        kh_name: string;          // e.g., "វ៉េន​​​ ដារ៉ា"
    };
    customer: {
        id: number;
        name: string
        sex_id: number;
        phone: string
    },
    status: {
        name: string;             // e.g., "បានទូទាត់"
    };
    details: {
        id: number;               // e.g., 1
        discount_id: number;      // e.g., 9
        invoice_id: number;       // e.g., 1
        payment_step_id: number;  // e.g., 1
        name: string;             // e.g., "តម្លៃសិក្សាភាសារខ្មែរ"
        unit_price: string;       // e.g., "500"
        total_price: string;      // e.g., "1000"
        qty: number;              // e.g., 1
        discount: string;         // e.g., "10"
        created_at: string | Date;// e.g., "2024-09-13T06:17:03.949Z"
        updated_at: string | Date;// e.g., "2024-09-13T06:17:03.949Z"
        payment_discount: {
            id: number;           // e.g., 9
            percentage: string;   // e.g., "50"
        };
        step: {
            id: number;           // e.g., 1
            name: string;         // e.g., "ប្រចាំឆ្នាំ"
        };
    }[];
    rate: {
        id: number;               // e.g., 1
        number: string;           // e.g., "4100"
    };
    academic_language: string | null;  // e.g., null
}
