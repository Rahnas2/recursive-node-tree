import { injectable } from "inversify";
import { INodeRepository } from "../../domain/repositories/INodeRepository";
import { Node } from "../../domain/entities/Node";
import { NodeModel } from "../db/models/NodeModel";
import mongoose from "mongoose";

@injectable()
export class NodeRepository implements INodeRepository {

    async finNodeById(id: string): Promise<Node | null> {
        const node = await NodeModel.findById(id)

        if (!node) return null

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
        const objectId = new mongoose.Types.ObjectId(id);

        const result = await NodeModel.aggregate([
            { $match: { _id: objectId } },
            {
                $graphLookup: {
                    from: "nodes",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parentId",
                    as: "descendants"
                }
            },
            {
                $project: {
                    allIds: {
                        $concatArrays: [["$_id"], "$descendants._id"]
                    }
                }
            }
        ]);

        const idsToDelete = result[0]?.allIds || [];

        await NodeModel.deleteMany({
            _id: { $in: idsToDelete }
        });

        return idsToDelete.map((id: any) => id.toString());
    }
}
