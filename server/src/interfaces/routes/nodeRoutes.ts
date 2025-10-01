import { Router } from "express";
import { container } from "../../infrastructure/config/inversify.config";
import { TYPES } from "../../infrastructure/config/types";
import { NodeController } from "../controllers/NodeController";

const router = Router();
const controller = container.get<NodeController>(TYPES.NodeController);

router.route('/')
.post(controller.create)
.get(controller.getTreeHandler)

router.route('/:id')
.delete(controller.delete) 

export default router;