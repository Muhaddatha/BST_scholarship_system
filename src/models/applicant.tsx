export enum status {
    freshman = "Freshman",
    sophomore = "Sophomore",
    junior = "Junior",
    senior = "Senior",
}

export enum gender {
    male = "Male",
    female = "Female",
}

export interface timestamp {
    nanoseconds: number,
    seconds: number,
}

export interface applicant {
    student_number: number,
    first_name: string,
    last_name: string,
    phone_number: string,
    gender: gender,
    date_of_birth: timestamp,
    status: status,
    cumulative_gpa: number,
    number_of_credit_hours: number,
}
