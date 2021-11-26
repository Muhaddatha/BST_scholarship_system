import { collection, getDocs, query, where, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { applicant, awardee } from "../models/applicant";



class DatabaseService {

    constructor() {
        console.log('database service constructed');
    }

    async getApplicant(student_number: number) : Promise<any[]> {
        const q = query(collection(db, "applicants"), where("student_number", "==", student_number));
        return (await (await getDocs(q)).docs.map((doc) => ({...doc.data(), id: doc.id })));
    } 

    async getApplicants() : Promise<any[]> {
        const applicantsCollectionRef = collection(db, "applicants");
        return (await (await getDocs(applicantsCollectionRef)).docs.map((doc) => ({...doc.data(), id: doc.id })));
    }

    async updateApplicant(applicant_id: string, updatedApplicant: any | applicant) : Promise<void> {
        const applicant_doc = doc(db, "applicants", applicant_id);
        return (await (await updateDoc(applicant_doc, updatedApplicant)));
    }

    async addApplicant(applicant_information: applicant | any) : Promise<any> {
        const applicantsCollectionRef = collection(db, "applicants");
        return (await (await addDoc(applicantsCollectionRef, applicant_information)));
    }

    async addAwardee(awardee_information: awardee | any) : Promise<any> {
        const awardeeCollectionRef = collection(db, "awardees");
        return (await (await addDoc(awardeeCollectionRef, awardee_information)));
    }

    async getAwardees(): Promise<any[]> {
        const awardeeCollectionRef = collection(db, "awardees");
        return (await (await getDocs(awardeeCollectionRef)).docs.map((doc) => ({...doc.data(), id: doc.id })));
    }
}

export default new DatabaseService();