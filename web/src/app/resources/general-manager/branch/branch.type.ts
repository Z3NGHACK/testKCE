import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

// Modify the interface to match the JSON structure
export interface Listing extends Pagination {
    data: Branch[]
}

export interface Branch {
    id                      : number;
    school                  : string; 
    code                    : string;
    name                    : string;
    address                 : string;
    status                  : string;
    n_student               : number;
    teacher_count           : number;
}

export interface BranchCreateRequest {
    school_id: number;
    name: string;
    address: string;
    code: string;
    status_id?: number;
}

export interface BranchIncome {
    branch_id: number;
    branch_name: string;
    total_income: number;
}

export interface Statistic {
    student: {
        total: number;
        new: number;
    };
    invoice: {
        total_income: number;
        primary_total_income: number;
        primary_branches_income: BranchIncome[];
        branches_income: BranchIncome[];
    };
    staff: {
        total_staff: number;
    };
    classroom: {
        total_classroom: number;
    };
}

export interface Student {
    id: number;
    avatar: string;
    name: string;
    code: string;
    date: string; // ISO 8601 format date string
}

export interface Invoice {
    id: number;
    code: string;
    price: string;
    status: string; // Status in Khmer
}

export interface Classroom {
    id: number;
    academic_name: string;
    branch_id: number;
    branch: string;
    language: string;
    teacher_name: string;
    schedule: string;
    level_name: string;
    grade: string;
    total_students: number;
    total_female_students: number;
}

export interface Teacher {
    id: number;
    name: string;
    avatar: string;
    branch_id: number;
    phone: string;
    branch_name: string;
    total_classrooms: number;
    classrooms: Classroom[];
    created_at: string; 
}

export interface StaffRole {
    role_id: number;
    role_name: string;
}

export interface Staff {
    id: number;
    name: string;
    branch: string;
    roles: StaffRole[];
    avatar: string;
    phone: string;
    created_at: string; 
}

export interface GeneralData {
    statistic: Statistic;
    students: Student[];
    invoices: Invoice[];
}

export interface BranchDetail{
    id: number;
    school: string;
    code: string;
    status_id: number
    status: string;
    name: string;
    address: string;
    teacher_count: number;
    n_student: number;
}

export interface TeacherData {
    teacher: Teacher[];
    staff: Staff[];
}


export interface MainData {
    name: string;
    general: GeneralData;
    teacher: TeacherData;
    classroom: Classroom[];
    branchDetails: BranchDetail;
}