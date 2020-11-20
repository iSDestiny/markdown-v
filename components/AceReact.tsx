import AceEditor from 'react-ace';
// import 'ace-builds/src-noconflict/theme-monokai';
import '../ace-themes/palenight';
import 'ace-builds/src-noconflict/theme-chaos';
import 'ace-builds/src-noconflict/theme-dracula';
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

const AceReact = (props: AceProps) => {
    Vim.map('jj', '<Esc>', 'insert');
    Vim.map('jk', '<Esc>', 'insert');
    Vim.map('kj', '<Esc>', 'insert');
    Vim.defineEx('write', 'w', (editor: IAceEditor) => {
        console.log('saved!');
    });

    return (
        <AceEditor
            mode="markdown"
            theme={props.theme}
            onChange={props.onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{
                $blockScrolling: true
            }}
            showPrintMargin={false}
            wrapEnabled={true}
            fontSize={16}
            value={props.value}
            keyboardHandler="vim"
            height="100%"
            width={'' + props.width}
            setOptions={{
                wrap: true
            }}
        />
    );
};

export default AceReact;
