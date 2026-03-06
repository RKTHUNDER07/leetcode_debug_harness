// typeParser.ts

export type TypeNode =
  | { kind: "primitive"; name: string }
  | { kind: "vector"; elementType: TypeNode }
  | { kind: "pair"; first: TypeNode; second: TypeNode }
  | { kind: "map"; key: TypeNode; value: TypeNode }
  | { kind: "set"; elementType: TypeNode }
  | { kind: "pointer"; base: TypeNode }
  | { kind: "custom"; name: string };

const PRIMITIVES = new Set([
  "int",
  "long",
  "long long",
  "double",
  "bool",
  "char",
  "string",
  "float",
]);

export function parseType(raw: string): TypeNode {
  let type = normalize(raw);

  // Pointer handling
  if (type.endsWith("*")) {
    const baseType = type.slice(0, -1).trim();
    return {
      kind: "pointer",
      base: parseType(baseType),
    };
  }

  // vector<T>
  if (startsWithGeneric(type, ["vector"])) {
    const inner = extractGeneric(type);
    return {
      kind: "vector",
      elementType: parseType(inner),
    };
  }

  // pair<A,B>
  if (startsWithGeneric(type, ["pair"])) {
    const [first, second] = splitTopLevel(extractGeneric(type));
    return {
      kind: "pair",
      first: parseType(first),
      second: parseType(second),
    };
  }

  // map / unordered_map
  if (startsWithGeneric(type, ["map", "unordered_map"])) {
    const [key, value] = splitTopLevel(extractGeneric(type));
    return {
      kind: "map",
      key: parseType(key),
      value: parseType(value),
    };
  }

  // set / unordered_set
  if (startsWithGeneric(type, ["set", "unordered_set"])) {
    const inner = extractGeneric(type);
    return {
      kind: "set",
      elementType: parseType(inner),
    };
  }

  // Primitive
  if (PRIMITIVES.has(type)) {
    return { kind: "primitive", name: type };
  }

  // Custom type (ListNode, TreeNode, Node, etc.)
  return { kind: "custom", name: type };
}

// ------------------ Utilities ------------------

function normalize(type: string): string {
  return type
    .replace(/\s+/g, " ")
    .replace(/\s*</g, "<")
    .replace(/>\s*/g, ">")
    .trim();
}

function startsWithGeneric(type: string, names: string[]): boolean {
  return names.some((name) => type.startsWith(name + "<"));
}

function extractGeneric(type: string): string {
  const start = type.indexOf("<");
  const end = type.lastIndexOf(">");
  return type.substring(start + 1, end).trim();
}

// Splits A,B while respecting nested <>
function splitTopLevel(input: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";

  for (let char of input) {
    if (char === "<") depth++;
    if (char === ">") depth--;

    if (char === "," && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}
