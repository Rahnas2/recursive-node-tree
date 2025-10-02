import { Network } from 'lucide-react'

const Header = () => {
    return (
        <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
                <Network className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-800">Recursive Node Tree</h1>
            </div>
            <p className="text-gray-600">
                Create and manage hierarchical nodes with expand/collapse functionality
            </p>
        </div>
    )
}

export default Header