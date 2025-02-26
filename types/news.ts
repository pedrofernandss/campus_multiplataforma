export interface News {
    id: string;
    mainTitle: string;
    description: string;
    content: string;
    authors: Array<string>;
    thumbnail: string;
    createdAt: Date | string;
    published: boolean;
}