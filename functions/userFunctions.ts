import { collection, getDocs, query, orderBy, where, getDoc, doc  } from "firebase/firestore";
import { db, auth } from "../firebase.config";
import { User } from "../types/user";

export const fetchUser = async (): Promise<User[]> => {
    try {
        const currentUser = auth.currentUser;
        const userRef = doc(db, "users", currentUser.uid); 

        const docSnapshot = await getDoc(userRef); 

        if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as User;
            return [userData];
        }

    } catch (error) {
        console.error("Erro ao buscar as informações de usuário: ", error);
        throw error;
    }
};