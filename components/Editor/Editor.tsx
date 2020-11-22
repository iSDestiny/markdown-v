import React from 'react';
import dynamic from 'next/dynamic';
import ReactResizeDetector from 'react-resize-detector';
import classes from './Editor.module.scss';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { selectEditor } from '../../store/slices/editorSlice';

const AceReact = dynamic(() => import('./AceReact'), {
    ssr: false
});

interface EditorProps {
    value: string;
    setValue: (index: number, value: string) => void;
}

const Editor = ({ value, setValue }: EditorProps) => {
    const { current, canPreview } = useSelector(selectEditor);

    return (
        <ReactResizeDetector handleWidth>
            {({ width, targetRef }) => (
                <div
                    className={classNames(classes['ace-editor'], {
                        [classes['preview-on']]: canPreview
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
