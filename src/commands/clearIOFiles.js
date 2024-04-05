const vscode = require("vscode");
const { log, show } = require("../logger");

/*
PRE-CONDICIÓN: ninguna
POST-CONDICIÓN: Hace clear de las rutas de los archivos I/O para el build de Tailwind en la configuración del workspace.
*/
async function clearIOFiles() {
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
      log("INFO", "clearIOFiles", "Clearing Tailwind Input/Output files.");
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
      log(
        "INFO",
        "clearIOFiles",
        "Tailwind Input/Output files cleared correctly."
      );
    }
  } else {
    vscode.window.showWarningMessage(
      "No Tailwind Input/Output files to clear."
    );
    log("WARN", "clearIOFiles", "No Tailwind Input/Output files to clear.");
    show();
  }
}

module.exports = clearIOFiles;
