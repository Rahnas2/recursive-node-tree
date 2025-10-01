import { inject, injectable } from "inversify";
import { INodeRepository } from "../../domain/repositories/INodeRepository";
import { Node } from "../../domain/entities/Node";
import { TYPES } from "../../infrastructure/config/types";

interface TreeNode extends Node {
  children: TreeNode[];
}

@injectable()
export class GetTreeInteractor {
  constructor(
    @inject(TYPES.INodeRepository) private nodeRepo: INodeRepository
  ) {}

  async execute(): Promise<TreeNode[]> {
    const nodes = await this.nodeRepo.getAllNodes();
    const map = new Map<string, TreeNode>();
    nodes.forEach(n => map.set(n.id, { ...n, children: [] }));

    const roots: TreeNode[] = [];
    nodes.forEach(n => {
      if (n.parentId) {
        const parent = map.get(n.parentId);
        if (parent) parent.children.push(map.get(n.id)!);
      } else {
        roots.push(map.get(n.id)!);
      }
    });

    return roots;
  }
}
