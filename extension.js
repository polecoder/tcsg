const vscode = require("vscode");
const initProject = require("./src/commands/initProject.js");
const insertSnippet = require("./src/commands/insertSnippet.js");
const clearIOFiles = require("./src/commands/clearIOFiles.js");
const selectIOFiles = require("./src/commands/selectIOFiles.js");
const buildProject = require("./src/commands/buildProject.js");
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
      /* MODULE: ./src/commands/insertSnippet.js */
      commandId: "tcsg.insertSnippet",
      callback: insertSnippet,
    },
    {
      /* MODULE: ./src/commands/clearIOFiles.js */
      commandId: "tcsg.clearIOFiles",
      callback: clearIOFiles,
    },
    {
      /* MODULE: ./src/commands/selectIOFiles.js */
      commandId: "tcsg.selectIOFiles",
      callback: selectIOFiles,
    },
    {
      /* MODULE: ./src/commands/buildProject.js */
      commandId: "tcsg.buildProject",
      callback: buildProject,
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
