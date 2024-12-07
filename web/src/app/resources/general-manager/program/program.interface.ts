export interface General {
    id: number;
    name: string;
    level: string;
    price_per_year: string;
    languages: Language[];
    total_subjects: number;
    grade_scores: GradeScore[];
}

export interface Language {
    id: number;
    name: string;
    created_at: string;
    price: string;
    n_subjects: number;
}

export interface GradeScore {
    category_name: string;
    percentage: string;
    created_at: string;
}

export interface SubjectLanguage {
    id: number;
    name: string;
    created_at: string;
    subjects: Subject[];
}

export interface Subject {
    id: number;
    name: string;
    created_at: string;
}

export interface Payment {
    id: number;
    step_name: string;
    price: string;
}
export interface SchoolData {
    general: General;
    subjects: {
        languages: SubjectLanguage[];
    };
    payments: Payment[];
}
