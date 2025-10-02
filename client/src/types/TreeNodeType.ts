export interface TreeNodeType {
    id: string;
    name: string;
    parentId: string | null;
    childrenIds?: string[];
    isExpanded?: boolean;
}

export interface Node {
    id: string;
    name: string;
    parentId: string | null
}