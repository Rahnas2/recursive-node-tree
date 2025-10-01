import { Node } from "../entities/Node";

export interface INodeRepository {
    finNodeById(id: string): Promise<Node | null>
    createNode(name: string, parentId?: string | null): Promise<Node>;
    getAllNodes(): Promise<Node[]>;
    deleteNodeAndDescendants(id: string): Promise<string[]>;
}