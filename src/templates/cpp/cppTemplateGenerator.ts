import { Question } from "../../provider/questionProvider";

export function generateCppTemplate(question: Question): string {
  const paramList = question.parameters
    .map((p) => `${p.type} ${p.name}`)
    .join(", ");

  const testCalls = question.testCases
    .map((tc) => {
      const args = question.parameters
        .map((p) => formatValue(tc.input[p.name], p.type))
        .join(", ");

      const expected = formatValue(tc.expected, question.returnType);

      return `    cout << ${question.functionName}(${args}) << endl; // Expected: ${expected}`;
    })
    .join("\n");

  return `#include <bits/stdc++.h>
using namespace std;

${question.returnType} ${question.functionName}(${paramList}) {

    // Write your solution here

}

int main() {

${testCalls}

    return 0;
}
`;
}

function formatValue(value: any, type: string): string {
  if (type.startsWith("vector<")) {
    const innerType = type.substring(7, type.length - 1);

    const elements = value
      .map((v: any) => formatValue(v, innerType))
      .join(", ");

    return `{ ${elements} }`;
  }

  if (type === "string") {
    return '"' + value + '"';
  }

  if (type === "bool") {
    return value ? "true" : "false";
  }

  return String(value);
}
