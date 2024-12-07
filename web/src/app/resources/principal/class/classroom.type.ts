import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

// Modify the interface to match the JSON structure
export interface Listing extends Pagination {
    classrooms: Classrooms[]
}

export interface Classrooms {
    id                      : number;
    semester                : string;
    language                : string;
    teacher_name            : string;
    teacher_avatar          : string;
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

export interface Detail {
    general: General;
    students: Student[];
    schedules?: any[];
    classroom_shifts: ClassroomShift[]
}


export interface General{
    teacher_id          : number;
    academic_name       : string;
    grade_name          : string;
    language_name       : string;
    schedule_name       : string;
    total_shifts        : number;
    total_students      : number;
}

export interface Student {
    id: number;
    name: string;
    avatar: string;
    status: boolean;
}

export interface ClassroomShift {
    id: number;
    shift_id: number;
    shift_date: string;       // Date in ISO format
    start_at: string;         // DateTime in ISO format
    finish_at: string;        // DateTime in ISO format
    subjects: string[];
    total_students: number;
    attended_student: number;
}

export interface Academic {
    academic_branch_id: number;
    academic_name: string;
}

export interface Grade {
    id: number;
    name: string;
}

export interface Room {
    id: number;
    name: string;
    building_name: string;
    floor: number;
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Teacher {
    id: number;
    name: string;
    avatar: string;
}

export interface Language {
    id: number;
    name: string;
    icon: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface AcademicsResponse {
    academics: Academic[];
    grades: Grade[];
    rooms: Room[];
    levels: Level[];
    formattedTeachers: Teacher[];
    languages: Language[];
}


export interface Level {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
