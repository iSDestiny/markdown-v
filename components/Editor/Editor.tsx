import React from 'react';
import dynamic from 'next/dynamic';
import ReactResizeDetector from 'react-resize-detector';
import classes from './Editor.module.scss';
import classNames from 'classnames';

const AceReact = dynamic(() => import('./AceReact'), {
    ssr: false
});

interface EditorProps {
    current: number;
    value: string;
    preview: boolean;
    setValue: (index: number, value: string) => void;
}

const Editor = ({ value, setValue, preview, current }: EditorProps) => {
    return (
        <ReactResizeDetector handleWidth>
            {({ width, targetRef }) => (
                <div
                    className={classNames(classes['ace-editor'], {
                        [classes['preview-on']]: preview
                    })}
                    ref={targetRef}
                >
                    <AceReact
                        value={value}
                        width={width}
                        theme="palenight"
                        onChange={(newVal) => {
                            setValue(current, newVal);
                        }}
                    />
                </div>
            )}
        </ReactResizeDetector>
    );
};

export default Editor;
