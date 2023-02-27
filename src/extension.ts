// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

async function convertReadmeToHtml(readme: string, context: vscode.ExtensionContext) {
	var md = require('markdown-it')({
		html: true,
		linkify: true
	});
	var result = await md.render(readme);
	// create a new webview panel to render the html
	const panel = vscode.window.createWebviewPanel(
		'readme',
		'Readme',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		}
	);

	// get current font used in vscode
	var font = vscode.workspace.getConfiguration('editor').get('fontFamily');
	panel.webview.html = `
	<html> 
	<head>
	<style>
		html * {
			font-family: ${font};
		}
	</style>
	</head>
	<body>` + result + 
	`</body>
	</html>`;
	return result;
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('readme-parser.parse', () => {
		// get the current active text editor's content
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const text = document.getText();
			convertReadmeToHtml(text, context);
		} else {
			vscode.window.showErrorMessage("No active text editor");
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}