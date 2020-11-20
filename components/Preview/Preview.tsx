import React from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import gfm from 'remark-gfm';
import classes from './Preview.module.scss';
const ResizePanel = dynamic(() => import('react-resize-panel'), { ssr: false });

interface PreviewProps {
    value: string;
    isResizable?: boolean;
}

const Preview = ({ value, isResizable }: PreviewProps) => {
    const content = (
        <div className={classes['preview-container']}>
            <ReactMarkdown
                plugins={[gfm]}
                renderers={{ code: CodeBlock }}
                linkTarget="_blank"
            >
                {value}
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
