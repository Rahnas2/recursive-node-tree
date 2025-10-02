import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import type React from "react";
import type { TreeNodeType } from "../types/TreeNodeType";
import { useState } from "react";
import AddForm from "./AddForm";

interface TreeNodeProps {
    node: TreeNodeType;
    onToggle: (nodeId: string) => void;
    onAdd: (parentId: string | null, name: string) => void;
    onDelete: (nodeId: string) => void;
    level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, onToggle, onAdd, onDelete, level }) => {

    const [isAdding, setIsAdding] = useState(false);

    // Close Add Input
    const handleClose = () => {
        setIsAdding(false)
    }

    const hasChildren = node.children.length > 0;
    const indentColor = level % 3 === 0 ? 'border-blue-200' : level % 3 === 1 ? 'border-emerald-200' : 'border-amber-200'

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/50 transition-all group ${level === 0 ? 'bg-white shadow-sm mb-2' : ''
                    }`}
            >
                <button
                    onClick={() => onToggle(node.id)}
                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors ${!hasChildren ? 'invisible' : ''
                        }`}
                    disabled={!hasChildren}
                >
                    {node.isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                </button>

                <div className="flex-1 font-medium text-gray-800">{node.name}</div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="p-1.5 rounded-md hover:bg-emerald-100 text-emerald-600 transition-colors"
                        title="Add child node"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(node.id)}
                        className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors"
                        title="Delete node"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isAdding && (
                <AddForm parentId={node.id} onClose={handleClose} onSubmit={onAdd}/>
            )}

            {node.isExpanded && hasChildren && (
                <div className={`ml-8 mt-1 space-y-1 ${level >= 0 ? 'pl-4 border-l-2 ' + indentColor : ''}`}>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            onToggle={onToggle}
                            onAdd={onAdd}
                            onDelete={onDelete}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TreeNode