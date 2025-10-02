import { Network } from "lucide-react"

const EmptyTree = () => {
    return (
        <div className="text-center py-12">
            <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No nodes yet. Start by creating a root node!</p>
        </div>
    )
}

export default EmptyTree