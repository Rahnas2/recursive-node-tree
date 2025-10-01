import { injectable } from "inversify";
import { INodeRepository } from "../../domain/repositories/INodeRepository";
import { Node } from "../../domain/entities/Node";
import { NodeModel } from "../db/models/NodeModel";
import mongoose from "mongoose";

@injectable()
export class NodeRepository implements INodeRepository {

    async finNodeById(id: string): Promise<Node | null> {
        const node = await NodeModel.findById(id)
        
        if(!node) return null

        return { id: node._id.toString(), name: node.name, parentId: node.parentId?.toString() || null }
    }


    async createNode(name: string, parentId: string | null = null): Promise<Node> {
        const node = await NodeModel.create({ name, parentId })
        return { id: node._id.toString(), name: node.name, parentId: node.parentId?.toString() || null };
    }

    async getAllNodes(): Promise<Node[]> {
        const nodes = await NodeModel.find()
        return nodes.map(n => ({
            id: n._id.toString(),
            name: n.name,
            parentId: n.parentId ? n.parentId.toString() : null
        }));
    }

    async deleteNodeAndDescendants(id: string): Promise<string[]> {
        const allNodes = await NodeModel.find()
        const childrenMap = new Map<string, string[]>();

        allNodes.forEach((n: any) => {
            const pid = n.parentId ? n.parentId.toString() : null;

            if (!childrenMap.has(pid)) childrenMap.set(pid, []);

            childrenMap.get(pid)!.push(n._id.toString());
        });

        const toDelete = new Set<string>();
        const stack = [id];

        while (stack.length) {
            const cur = stack.pop()!;
            if (toDelete.has(cur)) continue;
            toDelete.add(cur);
            const children = childrenMap.get(cur);
            if (children) stack.push(...children);
        }

        await NodeModel.deleteMany({
            _id: { $in: Array.from(toDelete).map(i => new mongoose.Types.ObjectId(i)) }
        });

        return Array.from(toDelete);
    }
}
