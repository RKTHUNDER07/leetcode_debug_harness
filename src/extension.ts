import * as vscode from "vscode";
import * as path from "path";
import { getQuickPickItems, getQuestions } from "./provider/questionProvider";
import { generateCppTemplate } from "./templates/cpp/cppTemplateGenerator";
import { generatePythonTemplate } from "./templates/python/pythonTemplateGenerator";
import { generateJavaTemplate } from "./templates/java/javaTemplateGenerator";
import { generateJavaScriptTemplate } from "./templates/javascript/javascriptTemplateGenerator";

export function activate(context: vscode.ExtensionContext) {
  console.log("LeetCode Harness Extension Activated");

  const disposable = vscode.commands.registerCommand(
    "leetcode-test-harness.generateHarness",
    async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;

      if (!workspaceFolders) {
        vscode.window.showErrorMessage(
          "Please open a folder first (File → Open Folder).",
        );
        return;
      }

      const items = getQuickPickItems();

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Select a LeetCode problem",
      });

      if (!selected) return;

      const questions = getQuestions();

      const question = questions.find(
        (q) => `${q.id}. ${q.title}` === selected.label,
      );

      if (!question) {
        vscode.window.showErrorMessage("Question not found.");
        return;
      }
      const language = await vscode.window.showQuickPick(
        ["C++", "Python", "Java", "JavaScript"],
        { placeHolder: "Select language" },
      );

      if (!language) return;

      let code: string;
      let extension: string;
      let fileName: string; // ✅ declare here

      switch (language) {
        case "C++":
          code = generateCppTemplate(question);
          extension = "cpp";
          fileName = `${question.id}_${sanitizeFileName(question.title)}.${extension}`;
          break;

        case "Python":
          code = generatePythonTemplate(question);
          extension = "py";
          fileName = `${question.id}_${sanitizeFileName(question.title)}.${extension}`;
          break;

        case "Java":
          code = generateJavaTemplate(question);
          extension = "java";
        case "Java":
          code = generateJavaTemplate(question);
          extension = "java";
          fileName = `${sanitizeFileName(question.title)}.${extension}`;
          break; // ✅ Java special case
          break;

        case "JavaScript":
          code = generateJavaScriptTemplate(question);
          extension = "js";
          fileName = `${question.id}_${sanitizeFileName(question.title)}.${extension}`;
          break;

        default:
          return;
      }

      const rootPath = workspaceFolders[0].uri.fsPath;
      const filePath = path.join(rootPath, fileName);
      const fileUri = vscode.Uri.file(filePath);

      try {
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(code, "utf8"));

        await vscode.window.showTextDocument(fileUri);

        vscode.window.showInformationMessage(`Created ${fileName}`);
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to create file: ${error.message}`,
        );
      }
    },
  );

  context.subscriptions.push(disposable);
}

function sanitizeFileName(title: string): string {
  return title
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "_")
    .trim();
}

export function deactivate() {}
