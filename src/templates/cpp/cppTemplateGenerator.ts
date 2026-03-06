import { Question } from "../../provider/questionProvider";
import { parseType, TypeNode } from "../../core/typeParser";
import { generateClassProblemTemplate } from "./designEngine";
import {
  collectTypeKinds,
  generateHelperDeclarations,
  generateHelperDefinitions,
} from "./stlHelpers";

import {
  containsListNode,
  containsTreeNode,
  containsGraphNode,
} from "./typeDetection";

import {
  generateListDeclarations,
  generateListDefinitions,
} from "./listSupport";

import {
  generateTreeDeclarations,
  generateTreeDefinitions,
} from "./treeSupport";

import {
  generateGraphDeclarations,
  generateGraphDefinitions,
} from "./graphSupport";

import { getReturnPrintStatement } from "./printerRouting";

export function generateCppTemplate(question: Question): string {
  if (question.isClassProblem) {
    return generateClassProblemTemplate(question);
  }
  if (!question.parameters || !question.returnType || !question.functionName) {
    return "// Invalid question structure.";
  }

  // ================= Parse Types =================

  const parsedParams = question.parameters.map((p) => ({
    ...p,
    typeNode: parseType(p.type),
  }));

  const returnTypeNode = parseType(question.returnType);

  // ================= Collect STL Types =================

  const usedKinds = new Set<string>();
  parsedParams.forEach((p) => collectTypeKinds(p.typeNode, usedKinds));
  collectTypeKinds(returnTypeNode, usedKinds);

  // ================= Detect Special Types =================

  const needsList =
    parsedParams.some((p) => containsListNode(p.typeNode)) ||
    containsListNode(returnTypeNode);

  const needsTree =
    parsedParams.some((p) => containsTreeNode(p.typeNode)) ||
    containsTreeNode(returnTypeNode);

  const needsGraph =
    parsedParams.some((p) => containsGraphNode(p.typeNode)) ||
    containsGraphNode(returnTypeNode);

  // ================= Generate Helpers =================

  const helperDecl = generateHelperDeclarations(usedKinds);
  const helperDef = generateHelperDefinitions(usedKinds);

  const listDecl = needsList ? generateListDeclarations() : "";
  const listDef = needsList ? generateListDefinitions() : "";

  const treeDecl = needsTree ? generateTreeDeclarations() : "";
  const treeDef = needsTree ? generateTreeDefinitions() : "";

  const graphDecl = needsGraph ? generateGraphDeclarations() : "";
  const graphDef = needsGraph ? generateGraphDefinitions() : "";

  // ================= Build Function Signature =================

  const paramList = question.parameters
    .map((p) => `${p.type} ${p.name}`)
    .join(", ");

  // ================= Generate Test Calls =================

  const testCalls = (question.testCases ?? [])
    .map((tc) => {
      if (!tc.input) return "";

      const args = question
        .parameters!.map((p, i) => {
          const val = tc.input![p.name];
          const typeNode = parsedParams[i].typeNode;

          // ===== LinkedList Input =====
          if (containsListNode(typeNode)) {
            if (!Array.isArray(val)) return "nullptr";
            return `buildList({ ${val.join(", ")} })`;
          }

          // ===== Tree Input =====
          if (containsTreeNode(typeNode)) {
            if (!Array.isArray(val)) return "nullptr";

            const arr = val.map((v: any) =>
              v === null || v === "null" ? `"null"` : `"${v}"`,
            );

            return `buildTree({ ${arr.join(", ")} })`;
          }

          // ===== Graph Input =====
          if (containsGraphNode(typeNode)) {
            if (!Array.isArray(val)) return "nullptr";

            const rows = val.map((row: any[]) => `{ ${row.join(", ")} }`);

            return `buildGraph({ ${rows.join(", ")} })`;
          }

          // ===== STL / Primitive Input =====

          if (Array.isArray(val)) {
            return `{ ${val.join(", ")} }`;
          }

          if (typeof val === "string") {
            return `"${val}"`;
          }

          if (typeof val === "boolean") {
            return val ? "true" : "false";
          }

          return val;
        })
        .join(", ");

      const expected = formatExpected(tc.expected, returnTypeNode);

      return getReturnPrintStatement(
        returnTypeNode,
        `${question.functionName}(${args})`,
        expected,
      );
    })
    .join("\n");

  // ================= Final Template =================

  return `#include <bits/stdc++.h>
using namespace std;

// ===== STL Helper Declarations =====
${helperDecl}

// ===== Special Type Declarations =====
${listDecl}
${treeDecl}
${graphDecl}

// ===== User Solution =====
${question.returnType} ${question.functionName}(${paramList}) {

    // Write your solution here

}

// ===== Main =====
int main() {

${testCalls}

    return 0;
}

// ===== STL Helper Definitions =====
${helperDef}

// ===== Special Type Definitions =====
${listDef}
${treeDef}
${graphDef}
`;
}

// ================= Expected Formatter =================

function formatExpected(expected: any, typeNode: TypeNode): string {
  if (expected === null || expected === undefined) return "nullptr";

  if (typeNode.kind === "primitive") {
    if (typeof expected === "string") return `"${expected}"`;
    if (typeof expected === "boolean") return expected ? "true" : "false";
    return String(expected);
  }

  if (typeNode.kind === "pointer") {
    if (typeNode.base.kind === "custom" && typeNode.base.name === "ListNode") {
      return Array.isArray(expected) ? `{ ${expected.join(", ")} }` : "nullptr";
    }

    if (typeNode.base.kind === "custom" && typeNode.base.name === "TreeNode") {
      if (!Array.isArray(expected)) return "nullptr";
      return `{ ${expected
        .map((v) => (v === null || v === "null" ? "null" : String(v)))
        .join(", ")} }`;
    }

    if (typeNode.base.kind === "custom" && typeNode.base.name === "Node") {
      if (!Array.isArray(expected)) return "nullptr";

      const rows = expected.map((row: any[]) => `{ ${row.join(", ")} }`);

      return `{ ${rows.join(", ")} }`;
    }
  }

  if (Array.isArray(expected)) {
    return `{ ${expected.join(", ")} }`;
  }

  return String(expected);
}
