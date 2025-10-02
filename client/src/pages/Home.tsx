import { useEffect, useState } from "react";
import Header from "../components/Header"
import type { TreeNodeType } from "../types/TreeNodeType";
import EmptyTree from "../components/EmptyTree";
import TreeNode from "../components/TreeNode";
import AddForm from "../components/AddForm";
import AddRootButton from "../components/AddRootButton";
import { createNodeApi, deleteNodeApi, getTreeApi } from "../apis/nodeServices";
import toast from "react-hot-toast";



const Home = () => {
    const [nodes, setNodes] = useState<TreeNodeType[]>([]);
    const [isAddingRoot, setIsAddingRoot] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchTree = async () => {
            try {
                setIsLoading(true)
                const result = await getTreeApi()
                setNodes(result.tree)
            } catch (error: any) {
                toast.error(error?.response?.data?.message || 'something went wrong')
            } finally {
                setIsLoading(false)
            }
        }

        fetchTree()
    }, [])


    // Toggle Node

    const toggleNodeRecursively = (nodes: TreeNodeType[], nodeId: string): TreeNodeType[] => {
        return nodes.map((node) =>
            node.id === nodeId
                ? { ...node, isExpanded: !node.isExpanded }
                : { ...node, children: toggleNodeRecursively(node.children || [], nodeId) }
        );
    };

    const toggleNode = (nodeId: string) => {
        setNodes((prevNodes) => toggleNodeRecursively(prevNodes, nodeId));
    };

    // Handle Close Adding Root
    const handleCloseAddRoot = () => {
        setIsAddingRoot(false)
    }

    // Handle Open Adding Root
    const handleOpenAddRoot = () => {
        setIsAddingRoot(true)
    }

    const addNodeRecursively = (nodes: TreeNodeType[], parentId: string | null, newNode: TreeNodeType): TreeNodeType[] => {
        if (parentId === null) {
            return [...nodes, { ...newNode, children: [], isExpanded: false }];
        }

        return nodes.map((node) => {
            if (node.id === parentId) {
                return {
                    ...node,
                    isExpanded: true,
                    children: [...(node.children || []), { ...newNode, isExpanded: false }],
                };
            }
            return {
                ...node,
                children: addNodeRecursively(node.children || [], parentId, newNode),
            };
        });
    };


    const handleAddNode = async (parentId: string | null, name: string) => {
        try {
            const result = await createNodeApi(name, parentId)
            const newNode = result.node;

            setNodes((prev) => addNodeRecursively(prev, parentId, newNode));

            toast.success('node added')
        } catch (error: any) {
            console.error('error adding node', error)
            toast.error(error?.response?.data?.message || 'Failed to add node');
        }
    }

    const deleteNodeRecursively = (nodes: TreeNodeType[], nodeId: string): TreeNodeType[] => {
        return nodes
            .filter((node) => node.id !== nodeId)
            .map((node) => ({
                ...node,
                children: deleteNodeRecursively(node.children || [], nodeId),
            }));
    };

    const handleDeleteNode = async (nodeId: string) => {
        try {
            await deleteNodeApi(nodeId)
            setNodes((prev) => deleteNodeRecursively(prev, nodeId));
            toast.success('node deleted')
        } catch (error: any) {
            console.error('error deleting node', error)
            toast.error(error?.response?.data?.message || 'Failed to delete node');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <div className="max-w-4xl mx-auto py-12 px-4">
                <Header />

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
                    {nodes.length === 0 && !isAddingRoot && (
                        <EmptyTree />
                    )}
                    <div className="space-y-2">
                        {nodes.map((node) => (
                            <TreeNode
                                key={node.id}
                                node={node}
                                onToggle={toggleNode}
                                onAdd={handleAddNode}
                                onDelete={handleDeleteNode}
                                level={0}
                            />
                        ))}
                    </div>

                    {isAddingRoot ? (
                        <AddForm parentId={null} onClose={handleCloseAddRoot} onSubmit={handleAddNode} />
                    ) : (
                        <AddRootButton onOpen={handleOpenAddRoot} />
                    )}

                </div>

            </div>
        </div>
    )
}

export default Home