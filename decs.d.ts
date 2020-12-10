declare module 'react-resize-panel';
declare module 'react-katex';

interface Tag {
    tag: string;
}

interface NewNote {
    content?: string;
    title?: string;
    favorite?: boolean;
    tags?: Array<Tag>;
}

interface Note {
    _id: string;
    content: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    favorite: boolean;
    tags: Array<Tag>;
    isTemp?: boolean;
}
