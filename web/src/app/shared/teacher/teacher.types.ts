import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

export interface Listing extends Pagination {
    data: Teacher[];
}

export interface Teacher {
    id                  : number;
    name                : string;
    avatar              : string;
    phone               : string; 
    branch_name         : string;
    level               : string;  
    total_classrooms    : string;
    classrooms          : any[];
    created_at          : string | Date;
}

export interface View{
    general     : General;
    classrooms  : Classrooms[];
    file        : FileData[];
}

export interface General {
    id          : number;
    name        : string;
    email       : string;
    sex         : string;
    sex_id      : number;
    avatar      : string;
    phone       : string; 
    branch      : string;
    level       : string;  
    class       : string;
    created_at  : string | Date;  
    role_ids   : any[]
}




export interface Classrooms {
    id                      : number;
    semester                : string;
    language                : string;
    teacher_name            : string;
    schedule                : string;
    level_name              : string;
    shift                   : Shift;
    student_languages       : StudentLanguage[]; // Array of StudentLanguage objects
    total_students          : number;
    total_female_students   : number;
    grade                   : string;
    academic_name           : string;


}

export interface Shift {
    date               : string; // Ensure this matches the format of "YYYY-MM-DDTHH:MM:SSZ"
    start_at           : string; // Ensure this matches the format of "YYYY-MM-DDTHH:MM:SSZ"
    finish_at          : string; // Ensure this matches the format of "YYYY-MM-DDTHH:MM:SSZ"
}

export interface StudentLanguage {
    student_id         : number;
    student_name       : string;
    language_name      : string;
    schedule           : string;
    level              : string;
}


export interface FileData {
    id: number;
    name: string;
    uri: string;
    size: number; // In MB or appropriate size unit
    file_type: string;
    extension_id: number;
    extension_name: string;
    extension_icon: string;
    creator: number;
    creator_name: string;
    created_at: string; // ISO Date format
    creator_avatar: string;
    ischeck : boolean
  }
  