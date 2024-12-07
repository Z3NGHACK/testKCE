export interface Statistic {
    student: {
        total: number;
        new: number;
    };
    invoice: {
        total_income: number;
        total_debt: number;
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


export interface FormattedUser {
    name: string;
    avatar: string;
    role_id: number;
    role_name: string;
}

export interface DataResponse {
    data: {
        statistic: Statistic;   
        invoice_by_month: InvoiceByMonth;
        invoice: Invoice;
    };
    formattedUser: FormattedUser;
   
}

export interface BranchIncome {
    branch_id: number;
    branch_name: string;
    total_income: number;
  }

export interface InvoiceByMonth {
    មករា: number;
    កុម្ភៈ: number;
    មីនា: number;
    មេសា: number;
    ឧសភា: number;
    មិថុនា: number;
    កក្កដា: number;
    សីហា: number;
    កញ្ញា: number;
    តុលា: number;
    វិច្ឆិកា: number;
    ធ្នូ: number;
}

export interface GradeIncome {
    grade_id: number;
    grade_name: string;
    total_income: number;
  }
  
  export interface Invoice {
    primary_total_income: number;
    primary_grade_income: GradeIncome[];
  }
  