import * as vscode from "vscode";
import questions from "../Questions/questions.json";

export interface Question {
  id: number;
  title: string;
  difficulty: string;
  functionName: string;
  returnType: string;
  parameters: { name: string; type: string }[];
  testCases: any[];
}

export function getQuestions(): Question[] {
  return questions as Question[];
}

export function getQuickPickItems(): vscode.QuickPickItem[] {
  return getQuestions().map((q) => ({
    label: `${q.id}. ${q.title}`,
    description: q.difficulty,
  }));
}
