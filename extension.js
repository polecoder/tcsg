// The module 'vscode' contains the VS Code extensibility API

const vscode = require('vscode');
const {getWebviewContent} = require('./src/webview.js');
const {SnippetProvider} = require('./src/snippetProvider.js');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  const snippetProvider = new SnippetProvider();
  vscode.window.registerTreeDataProvider('snippetExplorerTCSG', snippetProvider);

  let commands = [
    {
      commandId: 'tcsg.helloWorld',
      callback: function () {
        vscode.window.showInformationMessage('Hello World from Tailwind Components Snippet Generator!');
        vscode.window.showInformationMessage('Current time is: ' + new Date().toLocaleTimeString());
      } 
    },
    {
      commandId: 'tcsg.showCustomizationUI',
      callback: function () {
        console.log('"showCustomizationUI" was called');
        const panel = vscode.window.createWebviewPanel(
          'snippetCustomization', // Identificador
          'Snippet Customization', // Título para display al usuario
          vscode.ViewColumn.One, // Columna donde mostrar el panel
          {}
        );

        panel.webview.html = getWebviewContent(); // Definido en ./src/webview.js
      }
    },
    {
      /*
      PRE-CONDICIÓN:
      lang == 'html' || lang == 'javascript'

      POST-CONDICIÓN:
      1) Si el editor activo es de tipo 'html' o 'javascript', inserta el snippet en el editor
      2) Si el editor activo no es de tipo 'html' o 'javascript', muestra un mensaje de error de lenguaje
      3) Si no se encuentra un editor activo, muestra un mensaje de error de no encontrar editor activo
      */
      commandId: 'tcsg.insertSnippet',
      callback: async function (snippet, lang) {
        console.log("Inserting snippet...", snippet, lang);
        const editor = vscode.window.activeTextEditor;
        if (editor && (lang === editor.document.languageId)) {
          // Confirmación del usuario
          const userConfirmation = await vscode.window.showQuickPick(['yes', 'no'], {
            placeHolder: 'Insert the ' + snippet.prefix + ' snippet?'
          })
          
          if (userConfirmation === 'yes') {
            console.log("Inserting snippet...", snippet);
            vscode.window.showInformationMessage('Inserting ' + snippet.prefix + ' snippet...');
            // snippetString tiene que ser una string, por esto usamos join
            const snippetString = snippet.body.join('\n');
            editor.insertSnippet(new vscode.SnippetString(snippetString));
          }

        } else if (editor && (lang !== editor.document.languageId)) {
          vscode.window.showErrorMessage('Invalid language. Please try again.');

        } else {
          vscode.window.showErrorMessage('No active text editor found. Please try again.');
        }
      }
    }
  ]

  commands.forEach(command => {
    let disposable = vscode.commands.registerCommand(command.commandId, command.callback);
    context.subscriptions.push(disposable);
  });
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
