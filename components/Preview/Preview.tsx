import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectEditor } from 'store/slices/editorSlice';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import gfm from 'remark-gfm';
import classes from './Preview.module.scss';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core';
import { InlineMath, BlockMath } from 'react-katex';
import math from 'remark-math';
import Image from 'next/image';

const ResizePanel: any = dynamic(() => import('react-resize-panel'), {
    ssr: false
});

interface PreviewProps {
    isResizable?: boolean;
}

interface MarkdownRenderProps {
    value?: string;
    children?: ReactNode;
}

interface MarkdownTable extends MarkdownRenderProps {
    columnAlignment?: string[];
    align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
}

interface MarkdownImage {
    alt?: string;
    src?: string;
    title?: string;
}

const Preview = ({ isResizable }: PreviewProps) => {
    const { notes, current } = useSelector(selectEditor);

    const renderers = {
        code: CodeBlock,
        inlineMath: ({ value }: MarkdownRenderProps) => (
            <InlineMath math={value} />
        ),
        math: ({ value }: MarkdownRenderProps) => <BlockMath math={value} />,
        image: ({ alt, src, title }: MarkdownImage) => (
            <img
                src={src}
                alt={alt}
                title={title}
                style={{ maxWidth: '100%' }}
            />
        ),
        table: ({ children }: MarkdownTable) => (
            <TableContainer classes={{ root: classes['table-root'] }}>
                <Table size="small" aria-label="a dense table">
                    {children}
                </Table>
            </TableContainer>
        ),
        tableHead: ({ children }: MarkdownTable) => (
            <TableHead>{children}</TableHead>
        ),

        tableBody: ({ children }: MarkdownTable) => (
            <TableBody>{children}</TableBody>
        ),
        tableRow: ({ children }: MarkdownTable) => (
            <TableRow classes={{ root: classes['table-row-root'] }}>
                {children}
            </TableRow>
        ),
        tableCell: ({ children, align }: MarkdownTable) => (
            <TableCell
                classes={{
                    head: classes['table-cell-head'],
                    body: classes['table-cell-body']
                }}
                align={align ? align : 'inherit'}
            >
                {children}
            </TableCell>
        )
    };

    const content = (
        <div className={classes['preview-container']}>
            <ReactMarkdown
                plugins={[gfm, math]}
                renderers={renderers}
                linkTarget="_blank"
            >
                {notes.find((note) => note._id === current)?.content}
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
