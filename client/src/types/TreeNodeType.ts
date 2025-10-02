export interface TreeNodeType {
    id: string;
    name: string;
    parentId: string | null;
    children: TreeNodeType [];
    isExpanded: boolean;
}