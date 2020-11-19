import Head from 'next/head';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import classes from '../styles/Home.module.scss';
import CodeBlock from '../components/CodeBlock';
import gfm from 'remark-gfm';
import TopMenu from '../components/TopMenu';
const ResizePanel = dynamic(() => import('react-resize-panel'), { ssr: false });
const AceReact = dynamic(() => import('../components/AceReact'), {
    ssr: false
});

export default function Home() {
    const [value, setValue] = useState('');

    return (
        <main className={classes.container}>
            <Head>
                <title>Markdown Notes</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className={classes['side-menu']}>
                <h1>A menu</h1>
            </section>
            <section className={classes['editor-container']}>
                <TopMenu />
                <div className={classes['editor-main']}>
                    <ResizePanel
                        direction="e"
                        handleClass={classes['custom-handle']}
                        style={{ width: '100%' }}
                    >
                        <div className={classes['ace-editor']}>
                            <AceReact
                                value={value}
                                theme="palenight"
                                onChange={(newVal) => {
                                    setValue(newVal);
                                }}
                            />
                        </div>
                    </ResizePanel>
                    <div className={classes['preview-container']}>
                        <ReactMarkdown
                            plugins={[gfm]}
                            renderers={{ code: CodeBlock }}
                            linkTarget="_blank"
                        >
                            {value}
                        </ReactMarkdown>
                    </div>
                </div>
            </section>
        </main>
    );
}
