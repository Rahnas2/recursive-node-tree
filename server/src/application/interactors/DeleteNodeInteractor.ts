import { inject, injectable } from "inversify";
import { INodeRepository } from "../../domain/repositories/INodeRepository";
import { TYPES } from "../../infrastructure/config/types";
import { NotFoundError, ValidationError } from "../errors/ApplicationError";

@injectable()
export class DeleteNodeInteractor {
  constructor(
    @inject(TYPES.INodeRepository) private nodeRepo: INodeRepository
  ) {}

  async execute(id: string): Promise<string[]> {
    if (!id) throw new ValidationError("Node ID required");

    const node = await this.nodeRepo.finNodeById(id)
    if(!node){
        throw new NotFoundError('Node Not Found')
    }
    
    return this.nodeRepo.deleteNodeAndDescendants(id);
  }
}
