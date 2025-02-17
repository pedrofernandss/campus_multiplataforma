import { collection, getDocs, query, orderBy, where, updateDoc, doc, deleteDoc  } from "firebase/firestore";
import { db } from "../firebase.config";
import { News } from "../types/news";

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

export const getAllNews = async (): Promise<News[]> => {
    try {
        const response = await getDocs(collection(db, "news")); 
        const news = response.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as News[];
        news.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return news

    } catch (error) {
        console.error("Erro ao buscar as todas as noticias: ", error);
        throw error;
    }
}

export const updateNewsStatus = async (newsId: string, published: boolean): Promise<void> => {
    try {
        const newsRef = doc(db, "news", newsId);
        await updateDoc(newsRef, { published });
        console.log("Status da notícia atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar o status da notícia: ", error);
        throw error;
    }
};

export const deleteNews = async (newsId: string): Promise<void> => {
    try {
        const newsRef = doc(db, "news", newsId);
        await deleteDoc(newsRef);
        console.log("Notícia deletada com sucesso!");
    } catch (error) {
        console.error("Erro ao deletar a notícia: ", error);
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