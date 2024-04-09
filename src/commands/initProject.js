const vscode = require("vscode");
const path = require("path");
const util = require("util");
// Admitir promesas con exec
const exec = util.promisify(require("child_process").exec);
// Admitir promesas con fs
const fs = require("fs").promises;
const { log, show } = require("../logger");

/**
 * WARNING: This function assumes that the workspace opened in VSCode is the project root.
 *
 * @brief Initializes a new project with the necessary dependencies and scripts.
 *
 * @description
 * 1) Initializes a npm project with the following dependencies: tailwindcss, prettier, prettier-plugin-tailwindcss, clean-css-cli, terser.
 * 2) Adds the necessary scripts to the package.json file.
 * 3) Creates the tailwind.config.js and .prettierrc files with the basic configuration needed.
 *
 * @returns {Promise<void>}
 */
async function initProject() {
  log("INFO", "initProject", "Initializing project.");
  const config = vscode.workspace.getConfiguration("tcsg");
  const inputFilePath = config.get("tailwindInputFilePath");
  const outputFilePath = config.get("tailwindOutputFilePath");

  const projectRoot = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";
  log("DEBUG", "initProject", `Project root: ${projectRoot}`);

  if (!projectRoot) {
    vscode.window.showErrorMessage(
      "No workspace folder found. Terminating process."
    );
    log(
      "ERROR",
      "initProject",
      "No workspace folder found. Terminating process."
    );
    show();
    return;
  }

  /* Inicializar el paquete con las dependencias básicas */
  try {
    log(
      "INFO",
      "initProject",
      "Initializing npm package and downloading basic dependancies."
    );
    const initCommand = `npm init -y && npm install -D tailwindcss prettier prettier-plugin-tailwindcss clean-css-cli terser`;
    const { stdout, stderr } = await exec(initCommand, { cwd: projectRoot });
    if (stdout)
      log("DEBUG", "initProject", `npm initialization stdout:\n${stdout}`);
    if (stderr)
      log("WARN", "initProject", `npm initialization stderr:\n${stderr}`);
  } catch (err) {
    vscode.window.showErrorMessage(
      "Error initializing npm package. Terminating process."
    );
    log(
      "ERROR",
      "initProject",
      "Error initializing npm package. Terminating process."
    );
    show();
    return;
  }

  /* Creamos el archivo tailwind.config.js para la configuración de Tailwind CSS */
  try {
    log("INFO", "initProject", "Creating Tailwind config file.");
    const tailwindConfigPath = path.join(projectRoot, "tailwind.config.js");
    log("DEBUG", "initProject", `Tailwind config path: ${tailwindConfigPath}`);
    const tailwindConfigContent = `module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
    await fs.writeFile(tailwindConfigPath, tailwindConfigContent, "utf-8");
    log("INFO", "initProject", "Tailwind config file created successfully.");
  } catch (err) {
    vscode.window.showErrorMessage(
      "Error creating Tailwind config file. Terminating process."
    );
    log(
      "ERROR",
      "initProject",
      "Error creating Tailwind config file. Terminating process."
    );
    show();
    return;
  }

  /* Creamos el archivo .prettierrc para la configuración de Prettier */
  try {
    log("INFO", "initProject", "Creating Prettier config file.");
    const prettierConfigPath = path.join(projectRoot, ".prettierrc");
    const prettierConfigContent = JSON.stringify(
      {
        plugins: ["prettier-plugin-tailwindcss"],
      },
      null,
      2
    );
    await fs.writeFile(prettierConfigPath, prettierConfigContent, "utf-8");
    log("INFO", "initProject", "Prettier config file created successfully.");
  } catch (err) {
    vscode.window.showErrorMessage(
      "Error creating Prettier config file. Terminating process."
    );
    log(
      "ERROR",
      "initProject",
      "Error creating Prettier config file. Terminating process."
    );
    show();
    return;
  }

  /* Agregamos los scripts básicos en el archivo package.json */
  try {
    let inputFilePathRelative = "";
    let outputFilePathRelative = "";
    let minifiedOutputFilePathRelative = "";
    const packagePath = path.join(projectRoot, "package.json");

    if (inputFilePath && outputFilePath) {
      log("INFO", "initProject", "Adding scripts to package.json.");
      const outputFileName = path.basename(outputFilePath, ".css");
      const outputFileFolderPath = path.dirname(outputFilePath);
      const minifiedOutputFilePath = path.join(
        outputFileFolderPath,
        `${outputFileName}.min.css`
      );

      /* Relativizar paths */
      inputFilePathRelative = path.normalize(
        path.relative(projectRoot, inputFilePath)
      );
      outputFilePathRelative = path.normalize(
        path.relative(projectRoot, outputFilePath)
      );
      minifiedOutputFilePathRelative = path.normalize(
        path.relative(projectRoot, minifiedOutputFilePath)
      );
    }

    log("DEBUG", "initProject", `Input file path: ${inputFilePathRelative}`);
    log("DEBUG", "initProject", `Output file path: ${outputFilePathRelative}`);
    log(
      "DEBUG",
      "initProject",
      `Minified output file path: ${minifiedOutputFilePathRelative}`
    );

    const packageJSON = JSON.parse(await fs.readFile(packagePath, "utf8"));
    const newScripts = {
      "format-all": "prettier --write .",
      "tailwind-build": `tailwindcss -i "${inputFilePathRelative}" -o "${outputFilePathRelative}"`,
      "minify-css": `cleancss -o "${minifiedOutputFilePathRelative}" "${outputFilePathRelative}"`,
      "minify-js": "",
      prep: "npm run tailwind-build && npm run minify-css && npm run minify-js",
    };

    packageJSON.scripts = {
      ...newScripts,
    };

    await fs.writeFile(
      packagePath,
      JSON.stringify(packageJSON, null, 2),
      "utf8"
    );
    log("INFO", "initProject", "Scripts added to package.json successfully.");
  } catch (err) {
    vscode.window.showErrorMessage(
      "Error adding scripts to package.json. Terminating process."
    );
    log(
      "ERROR",
      "initProject",
      "Error adding scripts to package.json. Terminating process."
    );
    show();
    return;
  }
  vscode.window.showInformationMessage("Project initialized successfully.");
  log("INFO", "initProject", "Project initialized successfully.");
}

module.exports = initProject;
