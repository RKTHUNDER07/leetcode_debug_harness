import { TypeNode } from "../../core/typeParser";

export function getReturnPrintStatement(
  returnType: TypeNode,
  functionCall: string,
  expected: string,
): string {
  if (returnType.kind === "primitive") {
    return `
    cout << ${functionCall}
         << " | Expected: ${expected}"
         << endl;`;
  }

  if (returnType.kind === "pointer" && returnType.base.kind === "custom") {
    if (returnType.base.name === "ListNode") {
      return `
    {
        ListNode* result = ${functionCall};
        printList(result);
        cout << " | Expected: ${expected}" << endl;
        deleteList(result);
    }`;
    }

    if (returnType.base.name === "TreeNode") {
      return `
    {
        TreeNode* result = ${functionCall};
        printTree(result);
        cout << " | Expected: ${expected}" << endl;
        deleteTree(result);
    }`;
    }
    if (returnType.base.name === "Node") {
      return `
    {
        Node* result = ${functionCall};
        printGraph(result);
        cout << " | Expected: ${expected}" << endl;
        deleteGraph(result);
    }`;
    }
  }

  return `
    {
        auto result = ${functionCall};
        printValue(result);
        cout << " | Expected: ${expected}" << endl;
    }`;
}
