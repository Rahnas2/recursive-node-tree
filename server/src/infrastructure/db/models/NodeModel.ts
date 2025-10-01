import { Schema, model, Document, Types } from "mongoose";

export interface NodeDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    parentId?: string | null;
}

const NodeSchema = new Schema<NodeDocument>({
    name: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Node", default: null }
}, { timestamps: true });

export const NodeModel = model<NodeDocument>("Node", NodeSchema);