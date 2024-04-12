const vscode = require("vscode");
const { log, show } = require("../logger");
const util = require("util");
// Admitir promesas con exec
const exec = util.promisify(require("child_process").exec);

/**
 * Compiles the Tailwind CSS file using the input and output file paths saved in the workspace configuration.
 *
 * @returns {Promise<void>}
 */
async function buildProject() {
  // Asumimos que el usuario hace el build de Tailwind en el primer directorio del workspace
  const projectRoot = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : ".";
  log("DEBUG", "buildProject", `Project root: ${projectRoot}`);
  if (!projectRoot) {
    vscode.window.showErrorMessage(
      "No workspace folder found. Terminating process."
    );
    log(
      "ERROR",
      "buildProject",
      "No workspace folder found. Terminating process."
    );
    show();
    return;
  }

  const buildCommand = "npm run prep";
  try {
    log("INFO", "buildProject", "Building the current project.");
    const { stdout, stderr } = await exec(buildCommand, { cwd: projectRoot });
    if (stdout)
      log("DEBUG", "initProject", `npm initialization stdout:\n${stdout}`);
    if (stderr)
      log("WARN", "initProject", `npm initialization stderr:\n${stderr}`);
    vscode.window.showInformationMessage("Project built correctly.");
    log("INFO", "buildProject", "Project built correctly.");
  } catch (err) {
    vscode.window.showErrorMessage(
      'Error building the project while running the "prep" command. Terminating process.'
    );
    log(
      "ERROR",
      "buildProject",
      'Error building the project while running the "prep" command. Terminating process.'
    );
    show();
  }
}

module.exports = buildProject;
