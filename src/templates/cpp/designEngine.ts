import { Question } from "../../provider/questionProvider";

export function generateClassProblemTemplate(question: Question): string {
  if (!question.className || !question.methods || !question.testCases) {
    return "// Invalid class problem structure.";
  }

  const className = question.className;
  const testCase = question.testCases[0];

  const operations = testCase.operations ?? [];
  const argumentsList = testCase.arguments ?? [];

  const operationsStr = operations.map((op: string) => `"${op}"`).join(", ");

  const argumentsStr = argumentsList
    .map((args: any[]) => `{ ${args.join(", ")} }`)
    .join(", ");

  const classMethods = generateMethodSkeletons(question);

  return `#include <bits/stdc++.h>
using namespace std;

// ===== User Class Implementation =====
class ${className} {
public:
    ${className}() {}

${classMethods}
};

// ===== Main =====
int main() {

    vector<string> operations = { ${operationsStr} };
    vector<vector<int>> arguments = { ${argumentsStr} };

    ${className}* obj = nullptr;

    cout << "{ ";

    for (size_t i = 0; i < operations.size(); ++i) {

        if (operations[i] == "${className}") {
            obj = new ${className}();
            cout << "null";
        }
${generateMethodExecutionBlocks(question)}
        if (i + 1 < operations.size()) cout << ", ";
    }

    cout << " }" << endl;

    delete obj;
    return 0;
}
`;
}

// ================= Method Skeleton Generator =================

function generateMethodSkeletons(question: Question): string {
  const methods = question.methods ?? [];
  const className = question.className!;

  let code = "";

  methods.forEach((method) => {
    if (method.name === className) return;

    const returnType = method.returnType || "void";
    const params = (method.parameters ?? [])
      .map((p: any) => `${p.type} ${p.name}`)
      .join(", ");

    code += `
    ${returnType} ${method.name}(${params}) {

    }
`;
  });

  return code;
}

// ================= Method Execution Blocks =================

function generateMethodExecutionBlocks(question: Question): string {
  const className = question.className!;
  const methods = question.methods ?? [];

  let blocks = "";

  methods.forEach((method) => {
    if (method.name === className) return;

    const isVoid = method.returnType === "void";
    const args = generateArgumentAccess(method.parameters ?? []);

    blocks += `
        else if (operations[i] == "${method.name}") {
            ${
              isVoid
                ? `obj->${method.name}(${args});`
                : `auto result = obj->${method.name}(${args});`
            }
            ${isVoid ? 'cout << "null";' : "cout << result;"}
        }`;
  });

  return blocks;
}

// ================= Argument Access =================

function generateArgumentAccess(parameters: any[]): string {
  if (!parameters.length) return "";

  return parameters.map((_, index) => `arguments[i][${index}]`).join(", ");
}
