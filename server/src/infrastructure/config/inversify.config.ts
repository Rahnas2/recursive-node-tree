import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

import { INodeRepository } from "../../domain/repositories/INodeRepository";
import { NodeRepository } from "../repositories/NodeRepository";

import { CreateNodeInteractor } from "../../application/interactors/CreateNodeInteractor";
import { GetTreeInteractor } from "../../application/interactors/GetTreeInteractor";
import { DeleteNodeInteractor } from "../../application/interactors/DeleteNodeInteractor";

import { NodeController } from "../../interfaces/controllers/NodeController";

const container = new Container();

// Repository
container.bind<INodeRepository>(TYPES.INodeRepository).to(NodeRepository);

// Interactors
container.bind<CreateNodeInteractor>(TYPES.CreateNodeInteractor).to(CreateNodeInteractor);
container.bind<GetTreeInteractor>(TYPES.GetTreeInteractor).to(GetTreeInteractor);
container.bind<DeleteNodeInteractor>(TYPES.DeleteNodeInteractor).to(DeleteNodeInteractor);

// Controller
container.bind<NodeController>(TYPES.NodeController).to(NodeController);

export { container };
