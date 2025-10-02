import { useEffect, useState } from "react";
import Header from "../components/Header"
import type { Node, TreeNodeType } from "../types/TreeNodeType";
import EmptyTree from "../components/EmptyTree";
import TreeNode from "../components/TreeNode";
import AddForm from "../components/AddForm";
import AddRootButton from "../components/AddRootButton";
import { createNodeApi, deleteNodeApi, getAllNodes } from "../apis/nodeServices";
import toast from "react-hot-toast";



const Home = () => {
    const [nodesMap, setNodesMap] = useState<{ [id: string]: TreeNodeType }>({});
    const [rootIds, setRootIds] = useState<string[]>([]);

    const [isAddingRoot, setIsAddingRoot] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchTree = async () => {
            try {
                setIsLoading(true)
                const result = await getAllNodes()
                const map: { [id: string]: TreeNodeType } = {};
                const roots: string[] = [];
                console.log('result ', result.nodes)

                result.nodes.forEach((n: Node) => {
                    map[n.id] = { ...n, childrenIds: [], isExpanded: false };
                });

                result.nodes.forEach((n: Node) => {
                    if (n.parentId) {
                        const parentNode = map[n.parentId];
                        if (parentNode) {
                            parentNode.childrenIds!.push(n.id);
                        } else {
                            console.warn(`Parent node not found for node ${n.id}`);
                        }
                    } else {
                        roots.push(n.id);
                    }
                });

                setNodesMap(map);
                setRootIds(roots);
            } catch (error: any) {
                console.error('error fetching data ', error)
                toast.error(error?.response?.data?.message || 'something went wrong')
            } finally {
                setIsLoading(false)
            }
        }

        fetchTree()
    }, [])

    const toggleNode = (nodeId: string) => {
        setNodesMap(prev => ({
            ...prev,
            [nodeId]: {
                ...prev[nodeId],
                isExpanded: !prev[nodeId].isExpanded,
            },
        }));
    };


    const handleAddNode = async (parentId: string | null, name: string) => {
        try {
            const result = await createNodeApi(name, parentId)
            const newNode: TreeNodeType = { ...result.node, childrenIds: [], isExpanded: false }

            if (parentId) {
                // Add child node
                setNodesMap(prev => ({
                    ...prev,
                    [newNode.id]: newNode,
                    [parentId]: {
                        ...prev[parentId],
                        isExpanded: true,
                        childrenIds: [...(prev[parentId].childrenIds || []), newNode.id],
                    }
                }));
            } else {
                // Add root node
                setNodesMap(prev => ({
                    ...prev,
                    [newNode.id]: newNode
                }));
                setRootIds(prevRoots => [...prevRoots, newNode.id]);
            }



            toast.success("Node added")
        } catch (error: any) {
            console.error('error adding node', error)
            toast.error(error?.response?.data?.message || 'Failed to add node');
        }
    }


    const handleDeleteNode = async (nodeId: string) => {
        try {
            setNodesMap(prev => {
                const newMap = { ...prev };
                const removeNodeRecursively = (id: string) => {
                    const node = newMap[id];
                    if (!node) return;
                    node.childrenIds?.forEach(removeNodeRecursively);
                    delete newMap[id];
                };
                removeNodeRecursively(nodeId);

                Object.values(newMap).forEach(n => {
                    if (n.childrenIds) {
                        n.childrenIds = n.childrenIds.filter(cid => cid !== nodeId);
                    }
                });

                return newMap;
            });

            await deleteNodeApi(nodeId)

            toast.success('node deleted')
        } catch (error: any) {
            console.error('error deleting node', error)
            toast.error(error?.response?.data?.message || 'Failed to delete node');
        }
    }


    // Handle Close Adding Root
    const handleCloseAddRoot = () => setIsAddingRoot(false)

    // Handle Open Adding Root
    const handleOpenAddRoot = () => setIsAddingRoot(true)

    // const nestedNodes = buildTree(rootIds);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <div className="max-w-4xl mx-auto py-12 px-4">
                <Header />

                {isLoading ? <div>loading...</div> :
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
                        {Object.keys(nodesMap).length === 0 && !isAddingRoot && (
                            <EmptyTree />
                        )}
                        <div className="space-y-2">
                            {rootIds.map((rootId) => {
                                const rootNode = nodesMap[rootId]
                                if (rootNode) {
                                    return (
                                        <TreeNode
                                            key={rootNode.id}
                                            node={rootNode}
                                            nodesMap={nodesMap}
                                            onToggle={toggleNode}
                                            onAdd={handleAddNode}
                                            onDelete={handleDeleteNode}
                                            level={0}
                                        />
                                    )
                                }
                            }
                            )}
                        </div>

                        {isAddingRoot ? (
                            <AddForm parentId={null} onClose={handleCloseAddRoot} onSubmit={handleAddNode} />
                        ) : (
                            <AddRootButton onOpen={handleOpenAddRoot} />
                        )}

                    </div>
                }

            </div>
        </div>
    )
}

export default Home