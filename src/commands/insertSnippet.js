const vscode = require("vscode");
const { log, show } = require("../logger");

/*
PRE-CONDICIÓN:
lang == 'html' || lang == 'javascript'

POST-CONDICIÓN:
1) Si el editor activo es de tipo 'html' o 'javascript', inserta el snippet en el editor
2) Si el editor activo no es de tipo 'html' o 'javascript', muestra un mensaje de error de lenguaje
3) Si no se encuentra un editor activo, muestra un mensaje de error de no encontrar editor activo
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
