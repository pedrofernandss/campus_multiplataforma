import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

export interface Tag {
    id: string;
    name: string;
    newsCount: number;
    color: string;
}

export const fetchTags = async (): Promise<Tag[]> => {
    try {
        const response = await getDocs(collection(db, "tags")); 
        const tags = response.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Tag[];
        tags.sort((a, b) => b.newsCount - a.newsCount);
        return tags;
    } catch (error) {
        console.error("Erro ao buscar as tags: ", error);
        throw error;
    }
};
