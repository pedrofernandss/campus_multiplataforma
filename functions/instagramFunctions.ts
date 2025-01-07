import { InstagramReels } from '@/constants/types'
import axios from 'axios'
import { useState } from 'react'

export const fetchInstagramMedia = async (): Promise<InstagramReels[]> => {
    try {
        const url =  `https://graph.instagram.com/${process.env.EXPO_PUBLIC_USER_ID}/media`
        const response = await axios.get(url,
            {
                params: {
                    fields: 'id,media_type,media_url,thumbnail_url,permalink',
                    access_token: process.env.EXPO_PUBLIC_INSTAGRAM_ACCESS_TOKEN
                }
            })
        const instagramMedia = response.data.data
        const filteredMedia = instagramMedia.filter(
            (item) => item.media_type === 'VIDEO'
        ) as InstagramReels[]
        return filteredMedia;       
    } catch (error) {
        console.error("Erro ao buscar os arquivos de vídeos: ", error);
        throw error;
    }
};