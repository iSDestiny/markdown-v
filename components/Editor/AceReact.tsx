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
    setCurrent
} from 'store/slices/editorSlice';
import useLoader from 'hooks/useLoader';
import { useEffect, useRef } from 'react';
import mod from 'utility/mod';

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
    const {
        editorType,
        current,
        notes,
        isLocalSearchOpen,
        isGlobalSearchOpen
    } = useSelector(selectEditor);
    const editorRef = useRef<AceEditor>();

    useLoader('modify', editIsLoading);

    useEffect(() => {
        const refCurr = editorRef.current;
        if (refCurr && !isGlobalSearchOpen && !isLocalSearchOpen) {
            refCurr.editor.focus();
        }
    }, [current, isGlobalSearchOpen, isLocalSearchOpen]);

    useEffect(() => {
        const refCurr = editorRef.current;
        if (refCurr) {
            refCurr.editor.gotoLine(1, 0, true);
        }
    }, [current]);

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

    const nextTab = () => {
        const index = notes.findIndex((note) => note._id === current);
        if (index > -1) {
            const newIndex = mod(index + 1, notes.length);
            const newCurrent = notes[newIndex]._id;
            dispatch(setCurrent({ current: newCurrent }));
        }
    };

    const prevTab = () => {
        const index = notes.findIndex((note) => note._id === current);
        if (index > -1) {
            const newIndex = mod(index - 1, notes.length);
            const newCurrent = notes[newIndex]._id;
            dispatch(setCurrent({ current: newCurrent }));
        }
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

    Vim.defineEx('tabnext', 'tabn', async (editor: IAceEditor) => {
        nextTab();
    });

    Vim.defineEx('tabprev', 'tabp', async (editor: IAceEditor) => {
        prevTab();
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
