import { Question } from "../../provider/questionProvider";

export function generateJavaScriptTemplate(question: Question): string {
  const paramList = question.parameters.map((p) => p.name).join(", ");

  const testCalls = question.testCases
    .map((tc) => {
      const args = question.parameters
        .map((p) => formatJSValue(tc.input[p.name], p.type))
        .join(", ");

      const expected = formatJSValue(tc.expected, question.returnType);

      return `console.log(${question.functionName}(${args})); // Expected: ${expected}`;
    })
    .join("\n");

  return `function ${question.functionName}(${paramList}) {

    // Write your solution here

}

${testCalls}
`;
}

function formatJSValue(value: any, type: string): string {
  if (type.startsWith("vector<")) {
    return JSON.stringify(value);
  }

  if (type === "string") return `"${value}"`;
  if (type === "bool") return value ? "true" : "false";

  return String(value);
}
