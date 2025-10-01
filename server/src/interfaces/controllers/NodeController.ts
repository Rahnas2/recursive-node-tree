import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/config/types";
import { CreateNodeInteractor } from "../../application/interactors/CreateNodeInteractor";
import { GetTreeInteractor } from "../../application/interactors/GetTreeInteractor";
import { DeleteNodeInteractor } from "../../application/interactors/DeleteNodeInteractor";
import { HttpStatus } from '../enums/HttpStatus';

@injectable()
export class NodeController {
    constructor(
        @inject(TYPES.CreateNodeInteractor) private createNode: CreateNodeInteractor,
        @inject(TYPES.GetTreeInteractor) private getTree: GetTreeInteractor,
        @inject(TYPES.DeleteNodeInteractor) private deleteNode: DeleteNodeInteractor
    ) { }

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, parentId } = req.body;
            const node = await this.createNode.execute(name, parentId);
            res.status(HttpStatus.CREATED).json({ success: true, node });
        } catch (err: any) {
            next(err)
        }
    }

    getTreeHandler = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const tree = await this.getTree.execute();
            res.json({ success: true, tree });
        } catch (err: any) { 
            next(err)
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            console.log('id in controller', id)
            await this.deleteNode.execute(id);
            res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            next(err)
        }
    }
}
