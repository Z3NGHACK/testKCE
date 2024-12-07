import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

// Modify the interface to match the JSON structure
export interface Listing extends Pagination {
    data: Subject[]
}

export interface Subject {

    id : number;
    subject: string;
    icon: string;
    create_at: string;
    rates: [];
    subjects: EachSubject[];

}

export interface SubjectCreateRequest {
    subject_id: number;
    icon: string;
    name: string;
}

interface EachSubject {
    id: number;
    name: string;
  }