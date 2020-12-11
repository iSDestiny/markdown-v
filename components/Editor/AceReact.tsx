import AceEditor from 'react-ace';
import './palenight';
import 'ace-builds/src-noconflict/keybinding-vim';
import 'ace-builds/src-noconflict/keybinding-vscode';
import 'ace-builds/src-noconflict/mode-markdown';
import { Vim } from 'ace-builds/src-noconflict/keybinding-vim';
import { IAceEditor } from 'react-ace/lib/types';
import { useMutateModifyNote } from '../../hooks/noteMutationHooks';
import { useDispatch, useSelector } from 'react-redux';
import {
    setNoteToSaved,
    toggleEdit,
    selectEditor,
    setIsGlobalSearchOpen,
    setEditorType
} from '../../store/slices/editorSlice';
import useLoader from '../../hooks/useLoader';
import { useEffect, useRef } from 'react';

interface AceProps {
    theme: string;
    onChange: (val: string) => void;
    note: Note;
    width: string | number;
}

const AceReact = ({ theme, onChange, note, width }: AceProps) => {
    const [
        mutateModifyNote,
        { isLoading: editIsLoading }
    ] = useMutateModifyNote();
    const dispatch = useDispatch();
    const { editorType, current, isGlobalSearchOpen } = useSelector(
        selectEditor
    );
    const editorRef = useRef<AceEditor>();

    useLoader('modify', editIsLoading);

    useEffect(() => {
        const refCurr = editorRef.current;
        if (refCurr && !isGlobalSearchOpen) {
            refCurr.editor.focus();
        }
    }, [current, isGlobalSearchOpen]);

    useEffect(() => {
        const refCurr = editorRef.current;
        if (refCurr) {
            refCurr.editor.gotoLine(1, 0, true);
        }
    }, [current]);

    useEffect(() => {
        dispatch(setEditorType({ type: 'vim' }));
    }, []);

    const save = async () => {
        console.log(Vim);
        if (note) {
            await mutateModifyNote(note);
            dispatch(setNoteToSaved());
        }
    };

    const saveQuit = async () => {
        await save();
        dispatch(toggleEdit());
    };

    const globalSearch = () => {
        dispatch(setIsGlobalSearchOpen({ open: true }));
    };

    Vim.unmap('<C-p>');
    Vim.map('jj', '<Esc>', 'insert');
    Vim.map('jk', '<Esc>', 'insert');
    Vim.map('kj', '<Esc>', 'insert');
    Vim.defineEx('write', 'w', async (editor: IAceEditor) => {
        save();
    });
    Vim.defineEx('quit', 'q', (editor: IAceEditor) => {
        dispatch(toggleEdit());
    });
    Vim.defineEx('wquit', 'wq', async (editor: IAceEditor) => {
        saveQuit();
    });

    return (
        <AceEditor
            ref={editorRef}
            mode="markdown"
            theme={theme}
            onChange={onChange}
            name="ace-editor"
            editorProps={{
                $blockScrolling: true
            }}
            showPrintMargin={false}
            wrapEnabled={true}
            fontSize={16}
            value={note ? note.content : ''}
            keyboardHandler={editorType ? editorType : null}
            height="100%"
            width={'' + width}
            setOptions={{
                wrap: true
            }}
            commands={[
                {
                    name: 'save',
                    bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
                    exec: () => save()
                },
                {
                    name: 'search',
                    bindKey: { win: 'Ctrl-P', mac: 'Command-P' },
                    exec: () => globalSearch()
                }
            ]}
        />
    );
};

export default AceReact;
