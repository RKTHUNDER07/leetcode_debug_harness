import * as vscode from "vscode";
import questions from "../Questions/questions.json";

export interface Question {
  id: number;
  title: string;
  difficulty: string;

  isClassProblem: boolean;

  // Function problem fields
  functionName?: string;
  returnType?: string;
  parameters?: {
    name: string;
    type: string;
  }[];

  // Class problem fields
  className?: string;
  methods?: Method[];

  testCases: TestCase[];
}

export interface Method {
  name: string;
  returnType: string;
  parameters: {
    name: string;
    type: string;
  }[];
}

export interface TestCase {
  input?: Record<string, any>;
  expected?: any;

  // For class problems
  operations?: string[];
  arguments?: any[][];
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
