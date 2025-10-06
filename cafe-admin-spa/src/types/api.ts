// General API Response Types
import type { User } from "./user";

export interface RegisterResponse {
    message: string;
} 

export interface LoginResponse {
    message: string;
    user: User;
    role: string, 
    access_token: string;
}

export interface LogoutResponse {
    message: string
}

export interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>
}