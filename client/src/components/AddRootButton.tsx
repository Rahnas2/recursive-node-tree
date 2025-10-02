import { Plus } from "lucide-react"
import type React from "react"

interface AddRootButtonProps {
    onOpen: () => void
}

const AddRootButton: React.FC<AddRootButtonProps> = ({onOpen}) => {
    return (
        <button
            onClick={onOpen}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
        >
            <Plus className="w-5 h-5" />
            Add Root Node
        </button>
    )
}

export default AddRootButton