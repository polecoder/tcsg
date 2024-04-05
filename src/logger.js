const vscode = require("vscode");

const outputChannel = vscode.window.createOutputChannel("TCSG Log");

/*
PRE-CONDICIÓN: date es un objeto Date()
POST-CONDICIÓN: Devuelve la fecha en una string con el siguiente formato: "YYYY-MM-DD HH:MM:SS"
*/
function formatDate(date) {
  return date.toISOString().replace(/T/, " ").replace(/\..+/, "");
}

function log(level, feature, message) {
  const timestamp = formatDate(new Date());
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${feature}] - ${message}`;
  outputChannel.appendLine(formattedMessage);
}

function show() {
  outputChannel.show();
}

module.exports = { log, show };
