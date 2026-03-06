import { TypeNode } from "../../core/typeParser";

// ================= TYPE COLLECTION =================

export function collectTypeKinds(typeNode: TypeNode, used: Set<string>) {
  used.add(typeNode.kind);

  switch (typeNode.kind) {
    case "vector":
      collectTypeKinds(typeNode.elementType, used);
      break;
    case "pair":
      collectTypeKinds(typeNode.first, used);
      collectTypeKinds(typeNode.second, used);
      break;
    case "map":
      collectTypeKinds(typeNode.key, used);
      collectTypeKinds(typeNode.value, used);
      break;
    case "set":
      collectTypeKinds(typeNode.elementType, used);
      break;
    case "pointer":
      collectTypeKinds(typeNode.base, used);
      break;
  }
}

// ================= HELPER DECLARATIONS =================

export function generateHelperDeclarations(used: Set<string>): string {
  let decl = `
template<typename T>
void printValue(const T& value);

void printValue(const string& value);
void printValue(const bool& value);
`;

  if (used.has("vector")) {
    decl += `
template<typename T>
void printValue(const vector<T>& vec);
`;
  }

  if (used.has("pair")) {
    decl += `
template<typename A, typename B>
void printValue(const pair<A, B>& p);
`;
  }

  if (used.has("map")) {
    decl += `
template<typename K, typename V>
void printValue(const map<K, V>& m);
template<typename K, typename V>
void printValue(const unordered_map<K, V>& m);
`;
  }

  if (used.has("set")) {
    decl += `
template<typename T>
void printValue(const set<T>& s);
template<typename T>
void printValue(const unordered_set<T>& s);
`;
  }

  return decl;
}

// =================

export function generateHelperDefinitions(used: Set<string>): string {
  let helpers = `
template<typename T>
void printValue(const T& value) {
    cout << value;
}

void printValue(const string& value) {
    cout << value;
}

void printValue(const bool& value) {
    cout << (value ? "true" : "false");
}
`;

  if (used.has("vector")) {
    helpers += `
template<typename T>
void printValue(const vector<T>& vec) {
    cout << "{ ";
    for (size_t i = 0; i < vec.size(); ++i) {
        printValue(vec[i]);
        if (i + 1 < vec.size()) cout << ", ";
    }
    cout << " }";
}
`;
  }

  if (used.has("pair")) {
    helpers += `
template<typename A, typename B>
void printValue(const pair<A, B>& p) {
    cout << "{ ";
    printValue(p.first);
    cout << ", ";
    printValue(p.second);
    cout << " }";
}
`;
  }

  if (used.has("map")) {
    helpers += `
template<typename K, typename V>
void printValue(const map<K, V>& m) {
    cout << "{ ";
    size_t count = 0;
    for (const auto& kv : m) {
        cout << "{ ";
        printValue(kv.first);
        cout << ", ";
        printValue(kv.second);
        cout << " }";
        if (++count < m.size()) cout << ", ";
    }
    cout << " }";
}

template<typename K, typename V>
void printValue(const unordered_map<K, V>& m) {
    cout << "{ ";
    size_t count = 0;
    for (const auto& kv : m) {
        cout << "{ ";
        printValue(kv.first);
        cout << ", ";
        printValue(kv.second);
        cout << " }";
        if (++count < m.size()) cout << ", ";
    }
    cout << " }";
}
`;
  }

  if (used.has("set")) {
    helpers += `
template<typename T>
void printValue(const set<T>& s) {
    cout << "{ ";
    size_t count = 0;
    for (const auto& val : s) {
        printValue(val);
        if (++count < s.size()) cout << ", ";
    }
    cout << " }";
}

template<typename T>
void printValue(const unordered_set<T>& s) {
    cout << "{ ";
    size_t count = 0;
    for (const auto& val : s) {
        printValue(val);
        if (++count < s.size()) cout << ", ";
    }
    cout << " }";
}
`;
  }

  return helpers;
}
