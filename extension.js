// The module 'vscode' contains the VS Code extensibility API

const vscode = require("vscode");
const initProject = require("./src/commands/initProject.js");
const path = require("path"); // buildTailwind
const { SnippetProvider } = require("./src/snippetProvider.js");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const snippetProvider = new SnippetProvider();
  vscode.window.registerTreeDataProvider(
    "snippetExplorerTCSG",
    snippetProvider
  );

  let commands = [
    {
      /*
      PRE-CONDICIÓN:
      lang == 'html' || lang == 'javascript'

      POST-CONDICIÓN:
      1) Si el editor activo es de tipo 'html' o 'javascript', inserta el snippet en el editor
      2) Si el editor activo no es de tipo 'html' o 'javascript', muestra un mensaje de error de lenguaje
      3) Si no se encuentra un editor activo, muestra un mensaje de error de no encontrar editor activo
      */
      commandId: "tcsg.insertSnippet",
      callback: async function (snippet, lang) {
        const editor = vscode.window.activeTextEditor;
        if (editor && lang === editor.document.languageId) {
          // Confirmación del usuario
          const userConfirmation = await vscode.window.showQuickPick(
            ["yes", "no"],
            {
              placeHolder: "Insert the " + snippet.prefix + " snippet?",
            }
          );
          if (userConfirmation === "yes") {
            vscode.window.showInformationMessage(
              "Inserting " + snippet.prefix + " snippet..."
            );
            // snippetString tiene que ser una string, por esto usamos join
            const snippetString = snippet.body.join("\n");
            editor.insertSnippet(new vscode.SnippetString(snippetString));
          }
        } else if (editor && lang !== editor.document.languageId) {
          vscode.window.showErrorMessage("Invalid language. Please try again.");
        } else {
          vscode.window.showErrorMessage(
            "No active text editor found. Please try again."
          );
        }
      },
    },
    {
      /*
      PRE-CONDICIÓN: ninguna
      POST-CONDICIÓN: Hace clear de las rutas de los archivos I/O para el build de Tailwind en la configuración del workspace.
      */
      commandId: "tcsg.clearIOFiles",
      callback: async function () {
        // Obtenemos las rutas de los archivos I/O desde la configuración actual del workspace
        const config = vscode.workspace.getConfiguration("tcsg");
        let inputFilePath = config.get("tailwindInputFilePath");
        let outputFilePath = config.get("tailwindOutputFilePath");

        if (inputFilePath && outputFilePath) {
          const userConfirmation = await vscode.window.showQuickPick(
            ["Yes, clear build files", "No, leave existing files"],
            {
              placeHolder:
                "Are you sure you want to clear Input/Output files for Tailwind Build?",
            }
          );
          if (userConfirmation === "Yes, clear build files") {
            const config = vscode.workspace.getConfiguration("tcsg");
            await config.update(
              "tailwindInputFilePath",
              "",
              vscode.ConfigurationTarget.Workspace
            );
            await config.update(
              "tailwindOutputFilePath",
              "",
              vscode.ConfigurationTarget.Workspace
            );
            vscode.window.showInformationMessage(
              "Tailwind Input/Output files have been cleared."
            );
          }
        } else {
          vscode.window.showInformationMessage(
            "No Tailwind Input/Output files to clear."
          );
        }
      },
    },
    {
      commandId: "tcsg.selectIOFiles",
      /*
      PRE-CONDICIÓN: ninguna
      POST-CONDICIÓN: Guarda las rutas de los archivos I/O para el build de Tailwind en la configuración del workspace.
      */
      callback: async function () {
        // Obtenemos las rutas de los archivos I/O desde la configuración actual del workspace
        const config = vscode.workspace.getConfiguration("tcsg");
        let inputFilePath = config.get("tailwindInputFilePath");
        let outputFilePath = config.get("tailwindOutputFilePath");

        let userConfirmation = "Yes, select new files";
        // Chequeamos si los archivos I/O ya han sido seleccionados, para ver si el usuario los quiere reemplazar
        if (inputFilePath && outputFilePath) {
          userConfirmation = await vscode.window.showQuickPick(
            ["Yes, select new files", "No, use existing files"],
            {
              placeHolder:
                "Input/Output files for Tailwind Build have already been set. Do you want to replace them?",
            }
          );
        }

        if (userConfirmation === "Yes, select new files") {
          // INPUT FILE
          const statusBarMessage = vscode.window.setStatusBarMessage(
            "Selecting Tailwind Input File..."
          );
          const inputUri = await vscode.window.showOpenDialog({
            canSelectMany: false,
            openLabel: "Select Input CSS File",
            filters: {
              "CSS Files": ["css"],
            },
          });
          statusBarMessage.dispose();
          if (!inputUri) {
            vscode.window.showErrorMessage(
              "No input file selected. Terminating process."
            );
            return;
          }

          // OUTPUT FILE
          vscode.window.setStatusBarMessage(
            "Selecting Tailwind Output File..."
          );
          const outputUri = await vscode.window.showOpenDialog({
            canSelectMany: false,
            openLabel: "Select Output CSS File",
            filters: {
              "CSS Files": ["css"],
            },
          });
          statusBarMessage.dispose();
          if (!outputUri) {
            vscode.window.showErrorMessage(
              "No output file selected. Terminating process."
            );
            return;
          }

          // Guardamos la ruta de los archivos seleccionados globalmente
          await config.update(
            "tailwindInputFilePath",
            inputUri[0].fsPath,
            vscode.ConfigurationTarget.Workspace
          );
          await config.update(
            "tailwindOutputFilePath",
            outputUri[0].fsPath,
            vscode.ConfigurationTarget.Workspace
          );

          vscode.window.showInformationMessage(
            "Tailwind Input/Ouput files have been set. Ready to build Tailwind CSS."
          );
        }
      },
    },
    {
      commandId: "tcsg.buildTailwind",
      /*
      PRE-CONDICIÓN: ninguna
      POST-CONDICIÓN: Hace build del archivo de Tailwind CSS usando las rutas de los archivos I/O guardadas en la configuración del workspace
      */
      callback: function () {
        // Obtenemos las rutas de los archivos I/O desde la configuración actual del workspace
        const config = vscode.workspace.getConfiguration("tcsg");
        const inputFilePath = config.get("tailwindInputFilePath");
        const outputFilePath = config.get("tailwindOutputFilePath");

        if (!inputFilePath || !outputFilePath) {
          vscode.window.showErrorMessage(
            "I/O files for the Tailwind Build process have not been set yet. Terminating process."
          );
          return;
        }

        // Asumimos que el usuario hace el build de Tailwind en el primer directorio del workspace
        const workspaceFolder = vscode.workspace.workspaceFolders
          ? vscode.workspace.workspaceFolders[0].uri.fsPath
          : ".";

        const inputFilePathRelative = path.relative(
          workspaceFolder,
          inputFilePath
        );
        const outputFilePathRelative = path.relative(
          workspaceFolder,
          outputFilePath
        );
        const buildCommand = `npx tailwindcss -i "${inputFilePathRelative}" -o "${outputFilePathRelative}" --watch`;

        // Ejecutamos el comando de build en un terminal
        const terminalName = "Tailwind Build";
        let terminal = vscode.window.terminals.find(
          (t) => t.name === terminalName
        );
        if (!terminal) {
          terminal = vscode.window.createTerminal(terminalName);
        }
        terminal.show();
        terminal.sendText(`cd "${workspaceFolder}"`);
        terminal.sendText(buildCommand);
      },
    },
    {
      /* MODULE: ./src/commands/initProject.js */
      commandId: "tcsg.initProject",
      callback: initProject,
    },
  ];

  commands.forEach((command) => {
    let disposable = vscode.commands.registerCommand(
      command.commandId,
      command.callback
    );
    context.subscriptions.push(disposable);
  });
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
