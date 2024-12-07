import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

// Modify the interface to match the JSON structure
export interface Listing extends Pagination {
    data: Item[]
}

export interface Item {
    id: number;
    name: string;
    code: string;
    avatar: string;
    sex: string;
    branch: string;
    class: string;
    created_at: string | Date;
}

export interface View {
    general: General;
    payment: any;
    classroom: any;
    attechments: any;
}

export interface General {
    avatar: string;
    kh_name: string;
    en_name: string;
    code: string;
    address: string;
    dob: string; // Ensure this matches the format of "YYYY-MM-DDTHH:MM:SSZ"
    pob: string;
    grade: string,
    acadimic: string,
    register_date: string | Date;
    sex: string;
    sex_id: number;
    parents: Parent[]; // Array of Parent objects
    languages: any[];
    invoices?: Invoice[];
}

// Additional interfaces for nested structures
export interface Parent {
    name: string;
    job: string;
    relation: string;
    phone1: string;
    phone2: string;
    email: string;
    telegram: string;
    facebook: string;
    address: string;
}

export interface AcademicLanguage {
    enroll_date: string; // Format as "YYYY-MM-DDTHH:MM:SSZ"
    grade: string;
    academic: string;
}

// Payment-related interfaces, if needed
export interface Payment {
    academic_language: AcademicLanguagePayment[];
}

export interface AcademicLanguagePayment {
    grade_id: number,
    student_language: StudentLanguage[];
    other_payment: OtherPayment[];
    invoice: Invoice[];
}

export interface StudentLanguage {
    id: number;
    language: string;
    step: string;
    price: string;
    discount: string;
}

export interface OtherPayment {
    id: number;
    discount: string | null;
    price: string;
    note: string | null;
    income: string;
}

export interface Invoice {
    id: number;
    receiver_id: number;
    code: string;
    total_discount: string;
    total_price: string;
    exchange_rate: string;
    payment_status: string | null;
}

export interface Parent {
    id?: number;
    name: string;
    job: string;
    relation: string;
    phone1: string;
    phone2: string | null;
    facebook: string | null;
    address: string;
    email: string | null;
    telegram: string | null;
}



