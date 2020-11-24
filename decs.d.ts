declare module 'react-resize-panel';

interface Note {
    _id: string;
    content: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    isTemp?: boolean;
}
