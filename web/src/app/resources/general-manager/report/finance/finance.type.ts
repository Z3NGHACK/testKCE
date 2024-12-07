export interface Branch {
    branch_name: string;
    total_invoices: number;
    total_invoices_in_riels: number; // New field for total invoices in riels
}

export interface AcademicYearData {
    academic_name: string;
    branches: Branch[];
    total_price: number;
    total_price_in_riels: number; // New field for total price in riels
}

export interface FinanceData {
    data: AcademicYearData[];
    total_finance: number;
    total_finance_in_riels: number; // New field for total finance in riels
    total_invoices: BranchInvoices[]; // List of branch-wise total invoices
}

export interface BranchInvoices {
    branch_name: string;
    total_invoices_in_riels: number; // New field for total invoices in riels for each branch
}
