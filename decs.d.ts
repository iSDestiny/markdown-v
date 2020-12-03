declare module 'react-resize-panel';

interface Note {
    _id: string;
    content: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    favorite: boolean;
    tags: [{ _id: string; tag: string }];
    isTemp?: boolean;
}
