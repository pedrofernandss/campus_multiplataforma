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

        news.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return news;
    } catch (error) {
        console.error("Erro ao buscar as noticias: ", error);
        throw error;
    }
};

export const getRelativeTime = (dateString: string): string => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffInMilliseconds = now.getTime() - createdAt.getTime();
    const units: {[key:string]: number} = {
        'ano': 1000 * 3600 * 24 * 365,  
        'mês': 1000 * 3600 * 24 * 30,   
        'sem': 1000 * 3600 * 24 * 7,    
        'dia': 1000 * 3600 * 24,        
        'hora': 1000 * 3600,             
        'min': 1000 * 60 
    };

    for(const [unit, millisecondsInUnit] of Object.entries(units)){
        const diff = Math.floor(diffInMilliseconds / millisecondsInUnit);
        if(diff >= 1){
            return `${diff} ${unit}`
        }
    }

    return 'Agora'

}