export function generateTreeDeclarations(): string {
  return `
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(const vector<string>& vals);
void printTree(TreeNode* root);
void deleteTree(TreeNode* root);
`;
}

export function generateTreeDefinitions(): string {
  return `
TreeNode* buildTree(const vector<string>& vals) {
    if (vals.empty() || vals[0] == "null") return nullptr;

    TreeNode* root = new TreeNode(stoi(vals[0]));
    queue<TreeNode*> q;
    q.push(root);

    size_t i = 1;
    while (!q.empty() && i < vals.size()) {
        TreeNode* node = q.front();
        q.pop();

        if (i < vals.size() && vals[i] != "null") {
            node->left = new TreeNode(stoi(vals[i]));
            q.push(node->left);
        }
        i++;

        if (i < vals.size() && vals[i] != "null") {
            node->right = new TreeNode(stoi(vals[i]));
            q.push(node->right);
        }
        i++;
    }

    return root;
}

void printTree(TreeNode* root) {
    if (!root) {
        cout << "{}";
        return;
    }

    vector<string> result;
    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();

        if (node) {
            result.push_back(to_string(node->val));
            q.push(node->left);
            q.push(node->right);
        } else {
            result.push_back("null");
        }
    }

    // Trim trailing nulls
    while (!result.empty() && result.back() == "null") {
        result.pop_back();
    }

    cout << "{ ";
    for (size_t i = 0; i < result.size(); ++i) {
        cout << result[i];
        if (i + 1 < result.size()) cout << ", ";
    }
    cout << " }";
}

void deleteTree(TreeNode* root) {
    if (!root) return;
    deleteTree(root->left);
    deleteTree(root->right);
    delete root;
}
`;
}
