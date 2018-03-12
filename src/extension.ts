'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { start } from 'repl';
import { EDOM } from 'constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "android-logcat-analyzer" is now active!');


    const dateDec = vscode.window.createTextEditorDecorationType({
        color: "red",
    });

    const timeDec = vscode.window.createTextEditorDecorationType({
        color: "blue",
    });


    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.analyze', () => {
        // The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const date: vscode.DecorationOptions[] = [];
        const time: vscode.DecorationOptions[] = [];
        const level: vscode.DecorationOptions[] = [];
        const pid: vscode.DecorationOptions[] = [];
        const tid: vscode.DecorationOptions[] = [];
        const app: vscode.DecorationOptions[] = [];
        const tag: vscode.DecorationOptions[] = [];
        const msg: vscode.DecorationOptions[] = [];

        //const line_num = editor.document.lineCount;
        const line_num = 2;
        for (var i = 0; i < line_num; i++) {
            var line = editor.document.lineAt(i);
            var text = line.text;
            if (text) {
                var matchs = parseLine(text);
                if (matchs !== null) {
                    var pos = new vscode.Position(i, 0);
                    for (var j = 1; j < matchs.length; j++) {
                        if (j === 1) {
                            //var r1 = range.with(range.start, new vscode.Position(range.start.line, range.start.character + matchs[j].length));
                            var r1 = new vscode.Range(pos, pos.with(pos.line, pos.character + matchs[j].length));
                            pos = r1.end;
                            console.log("sub range", r1);
                            const decoration = { range: r1 };
                            date.push(decoration);
                        }
                        if (j === 2) {
                            //var r2 = range.with(undefined, new vscode.Position(range.start.line, range.start.character + matchs[j].length));
                            var r2 = new vscode.Range(pos, pos.with(pos.line, pos.character + matchs[j].length));
                            console.log("sub range", r2);
                            const decoration = { range: r2 };
                            time.push(decoration);
                        }
                    }
                }
            }
        }

        editor.setDecorations(dateDec, date);
        editor.setDecorations(timeDec, time);
        // Display a message box to the user
        //vscode.window.showInformationMessage(text);
    });

    context.subscriptions.push(disposable);
}


const REGEX_AS = /(^\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d+)\s+(\d+)-(\d+)\/(.*?)\s+([VDIWE])\/(.*?):\s+(.*)|$/g;
const REGEX_CMD = /(^\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d+)\s+(\d+)\s+(\d+)\s+([VDIWE])\s+(.*?):\s+(.*)|$/g;
function parseLine(text: string, re = REGEX_CMD) {
    re.lastIndex = 0;
    var s = re.exec(text);
    if (s === null || s[0] === "") {
        return null;
    } else {
        //console.log(s);
        return s;
    }
}

function renderTag(text: string) {
}

// this method is called when your extension is deactivated
export function deactivate() {
}