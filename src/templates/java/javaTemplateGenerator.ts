import { Question } from "../../provider/questionProvider";

export function generateJavaTemplate(question: Question): string {
  const className = sanitizeJavaClassName(question.title);

  const paramList = question.parameters
    .map((p) => `${mapJavaType(p.type)} ${p.name}`)
    .join(", ");

  const testCalls = question.testCases
    .map((tc) => {
      const args = question.parameters
        .map((p) => formatJavaValue(tc.input[p.name], p.type))
        .join(", ");

      const expected = formatJavaValue(tc.expected, question.returnType);

      return `        System.out.println(${question.functionName}(${args})); // Expected: ${expected}`;
    })
    .join("\n");

  return `import java.util.*;

public class ${className} {

    public static ${mapJavaType(question.returnType)} ${question.functionName}(${paramList}) {

        // Write your solution here

        return 0;
    }

    public static void main(String[] args) {

${testCalls}

    }
}
`;
}

function sanitizeJavaClassName(title: string): string {
  let name = title
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "_")
    .trim();

  // Java class cannot start with digit
  if (/^\d/.test(name)) {
    name = "Q_" + name;
  }

  return name;
}

function mapJavaType(type: string): string {
  // Handle vector types first
  if (type.startsWith("vector<")) {
    const inner = type.substring(7, type.length - 1);
    return `List<${mapJavaWrapperType(inner)}>`;
  }

  // Normal return types
  switch (type) {
    case "int":
      return "int";
    case "long":
      return "long";
    case "double":
      return "double";
    case "bool":
      return "boolean";
    case "string":
      return "String";
    default:
      return type;
  }
}

function mapJavaWrapperType(type: string): string {
  if (type.startsWith("vector<")) {
    const inner = type.substring(7, type.length - 1);
    return `List<${mapJavaWrapperType(inner)}>`;
  }

  switch (type) {
    case "int":
      return "Integer";
    case "long":
      return "Long";
    case "double":
      return "Double";
    case "bool":
      return "Boolean";
    case "string":
      return "String";
    default:
      return type;
  }
}

function formatJavaValue(value: any, type: string): string {
  if (type.startsWith("vector<")) {
    const inner = type.substring(7, type.length - 1);
    return `List.of(${value.map((v: any) => formatJavaValue(v, inner)).join(", ")})`;
  }

  if (type === "string") return `"${value}"`;
  if (type === "bool") return value ? "true" : "false";

  return String(value);
}
