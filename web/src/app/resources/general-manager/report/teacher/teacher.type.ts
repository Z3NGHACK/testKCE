export interface Branch {
    branch_name: string;
    n_teacher: number;
    n_female_teacher: number;
    n_male_teacher: number;
}

export interface AcademicYear {
    academic_name: string;
    branches: Branch[];
    total_teachers: number;
    total_female_teachers: number;
    total_male_teachers: number;
}

export interface BranchTotal {
    branch_name: string;
    total_teachers: number;
    total_female_teachers: number;
    total_male_teachers: number;
}


export interface TeacherStatistics {
    data: AcademicYear[];
    branchTotals: BranchTotal[];
    totalMaleTeachers: number;
    totalFemaleTeachers: number;
    overallTotalTeachers: number;
}