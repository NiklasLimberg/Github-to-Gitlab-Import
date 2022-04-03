
// currently just chrome supports the way vite uses workers in dev mode
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-ignore
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// @ts-ignore
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// @ts-ignore
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
/* eslint-enable @typescript-eslint/ban-ts-comment */

import 'monaco-editor/esm/vs/basic-languages/php/php.contribution'

export default function () {
    window.MonacoEnvironment = {
        getWorker (_, label) {
            switch (label) {
            case 'json':
                return new JsonWorker()
            case 'css' || 'scss' || 'less':
                return new CssWorker()
            case 'html':
                return new HtmlWorker()
            case 'typescript' || 'javascript':
                return new TsWorker()
            default: return new EditorWorker()
            }
        }
    }
}
