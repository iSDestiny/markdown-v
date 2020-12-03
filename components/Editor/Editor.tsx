import React from 'react';
import dynamic from 'next/dynamic';
import ReactResizeDetector from 'react-resize-detector';
import classes from './Editor.module.scss';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { selectEditor, setNotesFromEdit } from '../../store/slices/editorSlice';

const AceReact = dynamic(() => import('./AceReact'), {
    ssr: false
});

const Editor = () => {
    const dispatch = useDispatch();
    const { current, canPreview, notes } = useSelector(selectEditor);

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
                        note={notes.find((note) => note._id === current)}
                        width={width}
                        theme="palenight"
                        onChange={(newVal) => {
                            dispatch(setNotesFromEdit({ content: newVal }));
                        }}
                    />
                </div>
            )}
        </ReactResizeDetector>
    );
};

export default Editor;
