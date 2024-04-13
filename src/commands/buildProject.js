const vscode = require("vscode");
const { log, show } = require("../logger");
const util = require("util");
// Admitir promesas con exec
const exec = util.promisify(require("child_process").exec);

/**
 * WARNING: This function will not work correctly if the project isn't initialized before.
 *
 * Builds the current project by running the "prep" command created in the package.json file.
 *
 * @returns {Promise<void>}
 *
 * @throws {Error}
 * 1) If no workspace folder is found.
 * 2) If there is an error building the project.
 */
async function buildProject() {
  // Asumimos que el usuario hace el build de Tailwind en el primer directorio del workspace
  const projectRoot = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";
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
    throw new Error("No workspace folder found. Terminating process.");
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
    throw new Error(
      'Error building the project while running the "prep" command. Terminating process.'
    );
  }
}

module.exports = buildProject;
