// Auth-related interface
export interface RegisterValues {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: "admin"
}

export interface LoginValues {
    email: string;
    password: string;
}

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