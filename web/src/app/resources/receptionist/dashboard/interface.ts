export interface reDashboardReponse {
    statistic: IConclusionData;
    students: IStudent[];
}

export interface IConclusionData {
    student: {
        total: number;
        new: number;
        total_male: number;
        total_female: number;
    };
}

export interface IStudent {
    id: number;
    avatar: string;
    name: string;
    code: string;
    date: string;  // Changed from Date to string to match the format in the JSON
}
