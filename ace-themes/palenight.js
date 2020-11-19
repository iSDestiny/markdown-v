const colors = {
    background: '#292D3E',
    foreground: '#A6ACCD',
    text: '#676E95',
    codeText: '#8E94B2',
    selectionBackground: '#3C435E',
    selectionForeground: '#FFFFFF',
    buttons: '#303348',
    selectionBackground: '#34324a',
    disabled: '#515772',
    contrast: '#202331',
    active: '#414863',
    border: '#2b2a3e',
    highlight: '#444267',
    tree: '#676E95',
    notifications: '#202331',
    accentColor: '#ab47bc',
    excludedFilesColor: '#2f2e43',
    commentsColor: '#676E95',
    linksColor: '#80cbc4',
    functionsColor: '#82aaff',
    keywordsColor: '#c792ea',
    tagsColor: '#f07178',
    stringsColor: '#c3e88d',
    operatorsColor: '#89ddff',
    attributesColor: '#ffcb6b',
    numbersColor: '#f78c6c',
    parametersColor: '#f78c6c'
};

ace.define(
    'ace/theme/palenight',
    ['require', 'exports', 'module', 'ace/lib/dom'],
    function (require, exports, module) {
        exports.isDark = true;
        exports.cssClass = 'ace-palenight';
        exports.cssText = `.ace-palenight .ace_gutter {
background: ${colors.background};
color: ${colors.text}
}
.ace-palenight .ace_heading {
    color: ${colors.attributesColor}
}
.ace-palenight .ace_1,
.ace-palenight .ace_2,
.ace-palenight .ace_3,
.ace-palenight .ace_4,
.ace-palenight .ace_5 {
    colors: ${colors.operatorsColor}
}
.ace-palenight .ace_print-margin {
width: 1px;
background: transparent;
}
.ace-palenight {
background-color: ${colors.background};
color: ${colors.codeText};
}
.ace-palenight .ace_cursor {
color: ${colors.attributesColor}
}
.normal-mode .ace_hidden-cursors .ace_cursor {
    background-color: transparent;
    border: 1px solid ${colors.attributesColor};
    opacity: 0.7;
}
.ace-palenight .ace_marker-layer .ace_selection {
background: ${colors.selectionBackground}
}
.normal-mode .ace_cursor {
    border: none;
    background-color: rgba(255,203,107,0.5);
}
.ace-palenight.ace_multiselect .ace_selection.ace_start {
box-shadow: 0 0 3px 0px #272822;
}
.ace-palenight .ace_marker-layer .ace_step {
background: rgb(102, 82, 0)
}
.ace-palenight .ace_marker-layer .ace_bracket {
margin: -1px 0 0 -1px;
border: 1px solid #49483E
}
.ace-palenight .ace_marker-layer .ace_active-line {
background: ${colors.contrast}
}
.ace-palenight .ace_gutter-active-line {
background-color: ${colors.contrast}
}
.ace-palenight .ace_marker-layer .ace_selected-word {
border: 1px solid #49483E
}
.ace-palenight .ace_invisible {
color: #52524d
}
.ace-palenight .ace_entity.ace_name.ace_tag,
.ace-palenight .ace_keyword,
.ace-palenight .ace_meta.ace_tag,
.ace-palenight .ace_storage {
color: ${colors.keywordsColor}
}
.ace-palenight .ace_punctuation,
.ace-palenight .ace_punctuation.ace_tag {
color: ${colors.operatorsColor}
}
.ace-palenight .ace_constant.ace_character,
.ace-palenight .ace_constant.ace_language,
.ace-palenight .ace_constant.ace_numeric,
.ace-palenight .ace_constant.ace_other {
color: ${colors.numbersColor}
}
.ace-palenight .ace_invalid {
color: #F8F8F0;
background-color: #F92672
}
.ace-palenight .ace_invalid.ace_deprecated {
color: #F8F8F0;
background-color: #AE81FF
}
.ace-palenight .ace_support.ace_constant,
.ace-palenight .ace_identifier {
color: ${colors.functionsColor};
}
.ace-palenight .ace_support.ace_function {
    color: ${colors.stringsColor};
}
.ace-palenight .ace_paren {
    color: ${colors.operatorsColor};
}
.ace-palenight .ace_fold {
background-color: #A6E22E;
border-color: #F8F8F2
}
.ace-palenight .ace_storage.ace_type,
.ace-palenight .ace_support.ace_class,
.ace-palenight .ace_support.ace_type {
font-style: italic;
color: ${colors.keywordsColor}
}
.ace-palenight .ace_entity.ace_name.ace_function,
.ace-palenight .ace_entity.ace_other,
.ace-palenight .ace_entity.ace_other.ace_attribute-name,
.ace-palenight .ace_variable {
color: ${colors.attributesColor}
}
.ace-palenight .ace_variable.ace_parameter {
font-style: italic;
color: ${colors.parametersColor}
}
.ace-palenight .ace_string {
color: ${colors.stringsColor}
}
.ace-palenight .ace_comment {
color: ${colors.commentsColor}
}
.ace-palenight .ace_indent-guide {
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y
}`;

        var dom = require('../lib/dom');
        dom.importCssString(exports.cssText, exports.cssClass);
    }
);
(function () {
    ace.require(['ace/theme/palenight'], function (m) {
        if (typeof module == 'object' && typeof exports == 'object' && module) {
            module.exports = m;
        }
    });
})();
