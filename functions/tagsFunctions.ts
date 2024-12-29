import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { Tag } from "../constants/types";


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

export const defineTagColor = async (): Promise<string> => {
    const randomColor = Math.floor(Math.random() * 0xFFFFFF);
    const color = `#${randomColor.toString(16).padStart(6, '0')}`;
    return color;
}