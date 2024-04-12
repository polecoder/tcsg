const vscode = require("vscode");
const { log, show } = require("../logger");

/**
 * @brief Insert a snippet into the active text editor.
 *
 * @description
 * 1) If the active editor is of type 'html' or 'javascript', insert the snippet into the editor.
 * 2) If the active editor is not of type 'html' or 'javascript', display a language error message.
 * 3) If no active editor is found, display a no active editor error message.
 *
 * @param {Object} snippet
 * @param {string} lang
 * @returns {Promise<void>}
 */
async function insertSnippet(snippet, lang) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage(
      "No active text editor found. Terminating process."
    );
    log(
      "ERROR",
      "insertSnippet",
      "No active text editor found. Terminating process."
    );
    show();
    return;
  }

  if (lang === editor.document.languageId) {
    // Confirmación del usuario
    const userConfirmation = await vscode.window.showQuickPick(["yes", "no"], {
      placeHolder: `Insert the ${snippet.prefix} snippet?`,
    });
    if (userConfirmation === "yes") {
      log("INFO", "insertSnippet", `Inserting ${snippet.prefix} snippet.`);
      // snippetString tiene que ser una string, por esto usamos join
      const snippetString = snippet.body.join("\n");
      editor.insertSnippet(new vscode.SnippetString(snippetString));
    }
  } else {
    vscode.window.showErrorMessage(
      "Invalid language for the snippet selected. Please try again."
    );
    log(
      "WARN",
      "insertSnippet",
      "Invalid language for the snippet selected. Terminating process."
    );
    show();
  }
}

module.exports = insertSnippet;
