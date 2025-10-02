import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/config/types";
import { INodeRepository } from "../../domain/repositories/INodeRepository";
import { Node } from "../../domain/entities/Node";

@injectable()
export class GetAllNodesInteractor {
    constructor(
        @inject(TYPES.INodeRepository) private nodeRepo: INodeRepository
      ) {}

      async execute(): Promise<Node[]>{
        const nodes = await this.nodeRepo.getAllNodes();
        return nodes
      }
}