const vscode = require("vscode");
const { log, show } = require("../logger");

/**
 * Saves the Tailwind Input/Output files to the workspace configuration.
 *
 * @returns {Promise<void>}
 */
async function selectIOFiles() {
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
    log("INFO", "selectIOFiles", "Selecting Tailwind Input/Output files.");
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
      log(
        "ERROR",
        "selectIOFiles",
        "No input file selected. Terminating process."
      );
      show();
      return;
    }

    // OUTPUT FILE
    vscode.window.setStatusBarMessage("Selecting Tailwind Output File...");
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
      log(
        "ERROR",
        "selectIOFiles",
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

    log("DEBUG", "selectIOFiles", `Tailwind input file: ${inputUri[0].fsPath}`);
    log(
      "DEBUG",
      "selectIOFiles",
      `Tailwind output file: ${outputUri[0].fsPath}`
    );
    vscode.window.showInformationMessage(
      "Tailwind Input/Output files have been set. Ready to build Tailwind CSS."
    );
    log("INFO", "selectIOFiles", "Tailwind Input/Output files set correctly.");
  }
}

module.exports = selectIOFiles;
