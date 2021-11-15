import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase.config";



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
        return (await (await getDocs(applicantsCollectionRef)).docs );
    }
}

export default new DatabaseService();