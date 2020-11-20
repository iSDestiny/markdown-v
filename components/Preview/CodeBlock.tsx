import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeProps {
    language: string;
    value: string;
}

const CodeBlock = ({ language, value }: CodeProps) => {
    return (
        <SyntaxHighlighter language={language} style={vscDarkPlus}>
            {value ? value : ''}
        </SyntaxHighlighter>
    );
};

export default CodeBlock;
