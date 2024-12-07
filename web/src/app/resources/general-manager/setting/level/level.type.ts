
import { Data } from "@angular/router";
import Pagination from "helper/interfaces/pagination.interface";

// Modify the interface to match the JSON structure
export interface Listing extends Pagination {
    data: Level[]
}

export interface Level {

    id : number;
    level: string;
    create_at: string;

}

export interface LevelCreateRequest {
    level_id: number;
    description?: string;
    name: string;
}