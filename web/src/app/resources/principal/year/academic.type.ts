import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";
import { extend } from "lodash";

export interface Listing extends Pagination {
    data: Year[];
}

export interface Year {
    id: number;
    name: string;
    status: string;
    n_class: number;
    n_student: number;
}

export interface View {
    general: General;
    students: TableStudent;
}

export interface TableStudent {
    studentList: Student[];
}

export interface ListingStudent extends Pagination {
    data: Student[];
}

export interface Student {
    id: number;
    avatar: string;
    name: string;
    code: string;
    sex: 'ស្រី' | 'ប្រុស'; // Assuming these are fixed values
    branch: string;
    level: string;
    created_at: string; // Assuming this is an ISO date string; you can change to Date if needed
}

export interface Semester {
    id: number;
    title: string;
    start_date: string; // Assuming these are ISO date strings; can be Date type if preferred
    finish_date: string; // Assuming these are ISO date strings; can be Date type if preferred
}

export interface TotalPriceByBranch {
    branch_id: number;
    totalPrice: number;
    branch_name: string;
    totalStudents: number;
    femaleStudents: number;
}

export interface General {
    id: number;
    name: string;
    from_year: string; // Changed to ISO date string
    to_year: string; // Changed to ISO date string
    academics_status_id: number;
    status: string;
    semesters: Semester[];
    n_class: number;
    n_student: number;
    female_student_count: number;
    total_price_by_branch: TotalPriceByBranch[]; // New property added
    totalInvoicePrice: number; // New property added
}

export interface AttendenceReport {
    total_students: number;
    attended_students: number;
}

export interface Report {
    total_student: number;
    totalInvoicePrice: number;
    attendent_report: AttendenceReport; // New property added
}
