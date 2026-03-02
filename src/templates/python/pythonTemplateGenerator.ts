import { Question } from "../../provider/questionProvider";

export function generatePythonTemplate(question: Question): string {
  const paramList = question.parameters.map((p) => p.name).join(", ");

  const testCalls = question.testCases
    .map((tc) => {
      const args = question.parameters
        .map((p) => formatValue(tc.input[p.name], p.type))
        .join(", ");

      const expected = formatValue(tc.expected, question.returnType);

      return `print(${question.functionName}(${args}))  # Expected: ${expected}`;
    })
    .join("\n");

  return `# LeetCode Local Debug Mode (Python)
# Modify function freely

def ${question.functionName}(${paramList}):
    
    # Write your solution here
    

    pass


if __name__ == "__main__":

${indent(testCalls, 4)}
`;
}

function formatValue(value: any, type: string): string {
  if (type.startsWith("vector<")) {
    return JSON.stringify(value);
  }

  if (type === "string") {
    return `"${value}"`;
  }

  if (type === "bool") {
    return value ? "True" : "False";
  }

  return String(value);
}

function indent(text: string, spaces: number): string {
  return text
    .split("\n")
    .map((line) => " ".repeat(spaces) + line)
    .join("\n");
}
