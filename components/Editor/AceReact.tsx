import AceEditor from 'react-ace';
import './palenight';
import 'ace-builds/src-noconflict/keybinding-vim';
import 'ace-builds/src-noconflict/keybinding-vscode';
import 'ace-builds/src-noconflict/mode-markdown';
import { Vim } from 'ace-builds/src-noconflict/keybinding-vim';
import { IAceEditor } from 'react-ace/lib/types';
import { useMutateModifyNote } from '../../hooks/noteMutationHooks';
import { useDispatch } from 'react-redux';
import { setNoteToSaved, toggleEdit } from '../../store/slices/editorSlice';
import useLoader from '../../hooks/useLoader';

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
    useLoader('modify', editIsLoading);

    Vim.map('jj', '<Esc>', 'insert');
    Vim.map('jk', '<Esc>', 'insert');
    Vim.map('kj', '<Esc>', 'insert');
    Vim.defineEx('write', 'w', async (editor: IAceEditor) => {
        if (note) {
            await mutateModifyNote(note);
            dispatch(setNoteToSaved());
        }
    });
    Vim.defineEx('quit', 'q', (editor: IAceEditor) => {
        dispatch(toggleEdit());
    });
    Vim.defineEx('wquit', 'wq', async (editor: IAceEditor) => {
        if (note) {
            await mutateModifyNote(note);
            dispatch(toggleEdit());
            dispatch(setNoteToSaved());
        }
    });

    return (
        <AceEditor
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
            keyboardHandler="vim"
            height="100%"
            width={'' + width}
            setOptions={{
                wrap: true
            }}
        />
    );
};

export default AceReact;
