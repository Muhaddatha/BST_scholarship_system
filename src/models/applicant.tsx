import { Timestamp } from "@firebase/firestore";

export enum status {
    freshman = "freshman",
    sophomore = "sophomore",
    junior = "junior",
    senior = "senior",
}

export enum gender {
    male = "male",
    female = "female",
}

export interface applicant {
    student_number: number,
    first_name: string,
    last_name: string,
    phone_number: string,
    email_address: string,
    gender: gender,
    date_of_birth: Timestamp,
    status: status,
    cumulative_gpa: number,
    number_of_credit_hours: number,
}
