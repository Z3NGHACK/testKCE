
import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

// Modify the interface to match the JSON structure
export interface Listing extends Pagination {
    data: Staff[]
}
export interface Staff {
    id       : number;
    name     : string;
    branch   : string;
    roles    : any[]; // Array of roles
    avatar   : string;
    phone    : string;
    created_at: string;  // You can use Date type as well if needed
}

export interface View{
    general     : General;
    data        : General;
    file        : FileData[];
}

export interface General {
    id          : number;
    name        : string;
    email       : string;
    sex         : string;
    sex_id      : string;
    avatar      : string;
    phone       : string; 
    branch      : string;
    level       : string;  
    class       : string;
    created_at  : string | Date;  
    roles       : string[]
    role_ids    : any[]
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
  }