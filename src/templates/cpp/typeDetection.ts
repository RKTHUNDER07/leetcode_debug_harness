import { TypeNode } from "../../core/typeParser";

export function containsListNode(typeNode: TypeNode): boolean {
  if (
    typeNode.kind === "pointer" &&
    typeNode.base.kind === "custom" &&
    typeNode.base.name === "ListNode"
  ) {
    return true;
  }

  switch (typeNode.kind) {
    case "vector":
      return containsListNode(typeNode.elementType);
    case "pair":
      return (
        containsListNode(typeNode.first) || containsListNode(typeNode.second)
      );
    case "map":
      return containsListNode(typeNode.key) || containsListNode(typeNode.value);
    case "set":
      return containsListNode(typeNode.elementType);
    case "pointer":
      return containsListNode(typeNode.base);
    default:
      return false;
  }
}

export function containsTreeNode(typeNode: TypeNode): boolean {
  if (
    typeNode.kind === "pointer" &&
    typeNode.base.kind === "custom" &&
    typeNode.base.name === "TreeNode"
  ) {
    return true;
  }

  switch (typeNode.kind) {
    case "vector":
      return containsTreeNode(typeNode.elementType);
    case "pair":
      return (
        containsTreeNode(typeNode.first) || containsTreeNode(typeNode.second)
      );
    case "map":
      return containsTreeNode(typeNode.key) || containsTreeNode(typeNode.value);
    case "set":
      return containsTreeNode(typeNode.elementType);
    case "pointer":
      return containsTreeNode(typeNode.base);
    default:
      return false;
  }
}

export function containsGraphNode(typeNode: TypeNode): boolean {
  if (
    typeNode.kind === "pointer" &&
    typeNode.base.kind === "custom" &&
    typeNode.base.name === "Node"
  ) {
    return true;
  }

  switch (typeNode.kind) {
    case "vector":
      return containsGraphNode(typeNode.elementType);
    case "pair":
      return (
        containsGraphNode(typeNode.first) || containsGraphNode(typeNode.second)
      );
    case "map":
      return (
        containsGraphNode(typeNode.key) || containsGraphNode(typeNode.value)
      );
    case "set":
      return containsGraphNode(typeNode.elementType);
    case "pointer":
      return containsGraphNode(typeNode.base);
    default:
      return false;
  }
}
