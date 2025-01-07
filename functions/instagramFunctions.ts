import { InstagramReels } from '@/constants/types'
import axios from 'axios'

const getLastYearTimestamp = (): number => {
    const lastYearDate = new Date();
    lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);  
    lastYearDate.setMonth(0);
    lastYearDate.setDate(1);  
    lastYearDate.setHours(0, 0, 0, 0);  
    return Math.floor(lastYearDate.getTime() / 1000);  
};

export const fetchInstagramMedia = async (): Promise<InstagramReels[]> => {
    try {
        const url =  `https://graph.instagram.com/${process.env.EXPO_PUBLIC_USER_ID}/media`
        const response = await axios.get(url,
            {
                params: {
                    fields: 'id,media_type,media_url,thumbnail_url,permalink',
                    access_token: process.env.EXPO_PUBLIC_INSTAGRAM_ACCESS_TOKEN,
                    since: getLastYearTimestamp(),
                }
            })
        
        if(!response.data || !response.data.data){
            throw new Error("Dados não encontrados na resposta da API.");
        }

        let instagramMedia = [...response.data.data]
        
        let nextPage = response.data.paging?.next;
        while(nextPage){
            const nextResponse = await axios.get(nextPage);
            if (!nextResponse.data || !nextResponse.data.data) {
                break;
            }
            instagramMedia = [...instagramMedia, ...nextResponse.data.data];
            nextPage = nextResponse.data.paging?.next;
        }
        
        const aspectRatioArray = [0.6337, 0.9913, 0.9453, 1.1826]
        
        const filteredMedia = instagramMedia
            .filter((item) => item.media_type === 'VIDEO')
            .map((item) => ({
                ...item,
                aspect_ratio: aspectRatioArray[Math.floor(Math.random() * aspectRatioArray.length)],
            })) as InstagramReels[];
        
        return filteredMedia;
    } catch (error) {
        console.error("Erro ao buscar os arquivos de vídeos: ", error);
        throw error;
    }
};