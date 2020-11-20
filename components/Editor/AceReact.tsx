import AceEditor from 'react-ace';
import './palenight';
import 'ace-builds/src-noconflict/keybinding-vim';
import 'ace-builds/src-noconflict/keybinding-vscode';
import 'ace-builds/src-noconflict/mode-markdown';
import { Vim } from 'ace-builds/src-noconflict/keybinding-vim';
import { IAceEditor } from 'react-ace/lib/types';

interface AceProps {
    theme: string;
    onChange: (val: string) => void;
    value: string;
    width: string | number;
}

const AceReact = ({ theme, onChange, value, width }: AceProps) => {
    Vim.map('jj', '<Esc>', 'insert');
    Vim.map('jk', '<Esc>', 'insert');
    Vim.map('kj', '<Esc>', 'insert');
    Vim.defineEx('write', 'w', (editor: IAceEditor) => {
        console.log('saved!');
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
            value={value}
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
