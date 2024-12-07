export interface Branch {
    branch_name: string;
    n_student: number;
    n_female_student: number;
    n_male_student: number;
}

export interface AcademicYear {
    academic_name: string;
    branches: Branch[];
    total_students: number;
    total_female_students: number;
}

export interface BranchTotal {
    branch_name: string;
    total_students: number;
    total_female_students: number;
    total_male_students: number;
}

export interface ResponseData {
    data: AcademicYear[];
    branch_totals: BranchTotal[];
    branch_names: string[];
    totalFemaleStudents: number;
    totalMaleStudents: number;
    overallTotalStudents: number;
}
