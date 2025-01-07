import { collection, getDocs, query, orderBy, where  } from "firebase/firestore";
import { db } from "../firebase.config";
import { News } from "../constants/types";

export const fetchNews = async (): Promise<News[]> => {
    try {
        const response = await getDocs(query(collection(db, "news"), where("published", "==", true))); 
        const news = response.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as News[];
        return news;
    } catch (error) {
        console.error("Erro ao buscar as noticias: ", error);
        throw error;
    }
};