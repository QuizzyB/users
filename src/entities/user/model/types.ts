export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    skills: string[];
    registrationDate: string;
}

export interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    skills: { value: string }[];
}
