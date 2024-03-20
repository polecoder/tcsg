const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/* 
PRE-CONDICIÓN:
lang == 'html' || lang == 'javascript'

POST-CONDICIÓN:
Devuelve un objeto JSON con los snippets correspondientes al lenguaje pasado por parámetro
*/
function getSnippets(lang) {
  const snippetsPath = path.join(__dirname, `../snippets/${lang}.json`);
  const snippets = JSON.parse(fs.readFileSync(snippetsPath, 'utf8'));
  return snippets;
}

class SnippetProvider {
  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (element) {
      if (element.label === 'HTML Snippets') {
        const htmlSnippetsJSON = getSnippets('html');
        let htmlSnippets = [];
        // Añadimos los snippets al array de htmlSnippets, con el comando de insertar el snippet asignado a cada uno
        for (let key in htmlSnippetsJSON) {
          const treeItem = new vscode.TreeItem(key, vscode.TreeItemCollapsibleState.None);

          treeItem.label = "INSERT SNIPPET: " + key,

          treeItem.command = {
            command: 'tcsg.insertSnippet',
            title: 'Insert Selected Snippet',
            arguments: [htmlSnippetsJSON[key], 'html']
          };

          treeItem.iconPath = {
            light: path.join(__dirname, '../img/snippet-icon.svg'),
            dark: path.join(__dirname, '../img/snippet-icon.svg')
          };

          htmlSnippets.push(treeItem);
        }
        return htmlSnippets;

      } else if (element.label === 'Javascript Snippets') {
        const javascriptSnippetsJSON = getSnippets('javascript');
        let javascriptSnippets = [];
        // Añadimos los snippets al array de javascriptSnippets, con el comando de insertar el snippet asignado a cada uno
        for (let key in javascriptSnippetsJSON) {
          const treeItem = new vscode.TreeItem(key, vscode.TreeItemCollapsibleState.None);

          treeItem.label = "INSERT SNIPPET: " + key,

          treeItem.command = {
            command: 'tcsg.insertSnippet',
            title: 'Insert Selected Snippet',
            arguments: [javascriptSnippetsJSON[key], 'javascript']
          };

          treeItem.iconPath = {
            light: path.join(__dirname, '../img/snippet-icon.svg'),
            dark: path.join(__dirname, '../img/snippet-icon.svg')
          };
          
          javascriptSnippets.push(treeItem);
        }
        return javascriptSnippets;
      }
    } else { // Si no se pasa elemento, devolvemos los elementos root
      let rootItems = [];
      const html = new vscode.TreeItem('HTML Snippets', vscode.TreeItemCollapsibleState.Collapsed);
      html.iconPath = {
        light: path.join(__dirname, '../img/html-icon.svg'),
        dark: path.join(__dirname, '../img/html-icon.svg')
      };
      rootItems.push(html);

      const javascript = new vscode.TreeItem('Javascript Snippets', vscode.TreeItemCollapsibleState.Collapsed);
      javascript.iconPath = {
        light: path.join(__dirname, '../img/js-icon.svg'),
        dark: path.join(__dirname, '../img/js-icon.svg')
      };
      rootItems.push(javascript);
      
      return rootItems;
    }
  }
}

module.exports = {
  SnippetProvider
};