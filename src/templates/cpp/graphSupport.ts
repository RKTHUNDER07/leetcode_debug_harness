export function generateGraphDeclarations(): string {
  return `
class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() : val(0) {}
    Node(int _val) : val(_val) {}
};

Node* buildGraph(const vector<vector<int>>& adjList);
void printGraph(Node* node);
void deleteGraph(Node* node);
`;
}

export function generateGraphDefinitions(): string {
  return `
Node* buildGraph(const vector<vector<int>>& adjList) {
    if (adjList.empty()) return nullptr;

    int n = adjList.size();
    vector<Node*> nodes(n + 1, nullptr);

    for (int i = 1; i <= n; ++i) {
        nodes[i] = new Node(i);
    }

    for (int i = 0; i < n; ++i) {
        for (int neighbor : adjList[i]) {
            nodes[i + 1]->neighbors.push_back(nodes[neighbor]);
        }
    }

    return nodes[1];
}

void printGraph(Node* node) {
    if (!node) {
        cout << "{}";
        return;
    }

    unordered_map<Node*, bool> visited;
    queue<Node*> q;
    vector<vector<int>> result;

    q.push(node);
    visited[node] = true;

    while (!q.empty()) {
        Node* current = q.front();
        q.pop();

        vector<int> neighborsList;
        for (Node* neighbor : current->neighbors) {
            neighborsList.push_back(neighbor->val);
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
        result.push_back(neighborsList);
    }

    cout << "{ ";
    for (size_t i = 0; i < result.size(); ++i) {
        cout << "{ ";
        for (size_t j = 0; j < result[i].size(); ++j) {
            cout << result[i][j];
            if (j + 1 < result[i].size()) cout << ", ";
        }
        cout << " }";
        if (i + 1 < result.size()) cout << ", ";
    }
    cout << " }";
}

void deleteGraph(Node* node) {
    if (!node) return;

    unordered_set<Node*> visited;
    queue<Node*> q;

    q.push(node);
    visited.insert(node);

    while (!q.empty()) {
        Node* current = q.front();
        q.pop();

        for (Node* neighbor : current->neighbors) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }

        delete current;
    }
}
`;
}
