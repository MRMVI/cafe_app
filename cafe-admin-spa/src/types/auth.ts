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