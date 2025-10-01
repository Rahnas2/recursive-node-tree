import { inject, injectable } from "inversify";
import { INodeRepository } from "../../domain/repositories/INodeRepository";
import { Node } from "../../domain/entities/Node";
import { TYPES } from "../../infrastructure/config/types";
import { NotFoundError, ValidationError } from "../errors/ApplicationError";

@injectable()
export class CreateNodeInteractor {
    constructor(
        @inject(TYPES.INodeRepository) private nodeRepo: INodeRepository
    ) { }

    async execute(name: string, parentId?: string | null): Promise<Node> {
        if (!name.trim()) throw new ValidationError("Name is required");
        if (parentId) {
            const parentNode = await this.nodeRepo.finNodeById(parentId)
            if (!parentNode) {
                throw new NotFoundError('Parent Node Not Found')
            }
        }
        return this.nodeRepo.createNode(name, parentId || null);
    }
}