const sinon = require("sinon");
const vscode = require("vscode");
const assert = require("assert");

suite("[insertSnipet] With workspace tests", function () {
  let showQuickPickStub, showErrorMessageStub, activeTextEditorStub;

  setup(function () {
    showQuickPickStub = sinon.stub(vscode.window, "showQuickPick");
    showErrorMessageStub = sinon.stub(vscode.window, "showErrorMessage");
    activeTextEditorStub = {
      document: {
        languageId: "html",
      },
      insertSnippet: sinon.fake.resolves(true),
    };

    sinon
      .stub(vscode.window, "activeTextEditor")
      .get(() => activeTextEditorStub);
  });

  teardown(function () {
    sinon.restore();
  });

  /**
   * Test case for the insertSnippet command.
   * This test case will check if a snippet is inserted into the active text editor.
   */
  test("[WW-0] - Insert snippet into active text editor", async function () {
    const snippet = {
      prefix: "BTN",
      body: [
        '<button class="bg-indigo-600 text-white border-white border-[1px] py-1 px-3 uppercase rounded-md font-semibold hover:text-indigo-600 hover:bg-white hover:border-indigo-600 transition-all duration-200">Button</button>',
      ],
      description: "Primary button style",
    };

    showQuickPickStub.resolves("yes");
    await vscode.commands.executeCommand("tcsg.insertSnippet", snippet, "html");

    assert.ok(
      activeTextEditorStub.insertSnippet.calledOnce,
      "Snippet was not inserted"
    );
    assert.strictEqual(
      showErrorMessageStub.called,
      false,
      "Error message was displayed"
    );
  });

  /**
   * Test case for the insertSnippet command.
   * This test case will check if a snippet is not inserted when the text editor's language is not the same.
   */
  test("[WW-1] - Try to insert snippet into active text editor with invalid language", async function () {
    showQuickPickStub.resolves("yes");
    await vscode.commands.executeCommand(
      "tcsg.insertSnippet",
      {},
      "javascript"
    );

    assert.strictEqual(
      activeTextEditorStub.insertSnippet.called,
      false,
      "Snippet was inserted"
    );
    assert.ok(
      showErrorMessageStub.calledOnce,
      "Error message was not displayed"
    );
  });

  /**
   * Test case for the insertSnippet command.
   * This test case will check if no snippet is inserted when the user cancels the operation.
   */
  test("[WW-2] - User cancels snippet insertion", async function () {
    showQuickPickStub.resolves("no");
    await vscode.commands.executeCommand("tcsg.insertSnippet", {}, "html");

    assert.strictEqual(
      activeTextEditorStub.insertSnippet.called,
      false,
      "Snippet was inserted"
    );
    assert.strictEqual(
      showErrorMessageStub.called,
      false,
      "Error message was displayed"
    );
  });
});
