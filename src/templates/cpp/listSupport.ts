export function generateListDeclarations(): string {
  return `
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* buildList(const vector<int>& vals);
void printList(ListNode* head);
void deleteList(ListNode* head);
`;
}

export function generateListDefinitions(): string {
  return `
ListNode* buildList(const vector<int>& vals) {
    if (vals.empty()) return nullptr;

    ListNode* head = new ListNode(vals[0]);
    ListNode* current = head;

    for (size_t i = 1; i < vals.size(); ++i) {
        current->next = new ListNode(vals[i]);
        current = current->next;
    }

    return head;
}

void printList(ListNode* head) {
    cout << "{ ";
    while (head) {
        cout << head->val;
        if (head->next) cout << ", ";
        head = head->next;
    }
    cout << " }";
}

void deleteList(ListNode* head) {
    while (head) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }
}
`;
}
