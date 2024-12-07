export interface Statistic {
    student: {
        total: number;
        new: number;
    };
    invoice: {
        total_income: number;
        primary_total_income: number;
        branches_income: BranchIncome[];
        primary_branches_income: BranchIncome[];
    };
    staff: {
        total_staff: number;
    };
    academic: {
        total_academic: number;
    };
}

export interface Student {
    id: number;
    avatar: string;
    name: string;
    code: string;
    date: string;
}

export interface Invoice {
    id: number;
    code: string;
    price: string;
    status: string;

     
}

export interface FormattedUser {
    name: string;
    avatar: string;
    role_id: number;
    role_name: string;
}

export interface DataResponse {
    data: {
        statistic: Statistic;
        students: Student[];
        invoices: Invoice[];
    };
    formattedUser: FormattedUser;
    invoice: Invoice;
}

export interface Invoice{
  
}



export interface BranchIncome {
    branch_id: number;
    branch_name: string;
    total_income: number;
  }