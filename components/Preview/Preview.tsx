import React from 'react';
import { useSelector } from 'react-redux';
import { selectEditor } from '../../store/slices/editorSlice';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import gfm from 'remark-gfm';
import classes from './Preview.module.scss';
const ResizePanel: any = dynamic(() => import('react-resize-panel'), {
    ssr: false
});

interface PreviewProps {
    isResizable?: boolean;
}

const Preview = ({ isResizable }: PreviewProps) => {
    const { notes, current } = useSelector(selectEditor);
    const content = (
        <div className={classes['preview-container']}>
            <ReactMarkdown
                plugins={[gfm]}
                renderers={{ code: CodeBlock }}
                linkTarget="_blank"
            >
                {notes[current] ? notes[current].content : ''}
            </ReactMarkdown>
        </div>
    );
    return (
        <>
            {isResizable ? (
                <ResizePanel
                    direction="w"
                    handleClass={classes['custom-handle']}
                    style={{ width: '100%', maxWidth: 'calc(100% - 200px)' }}
                >
                    {content}
                </ResizePanel>
            ) : (
                content
            )}
        </>
    );
};

export default Preview;
