import React, { useState } from 'react'

interface AddFormProps {
    parentId: string | null,
    onClose: () => void,
    onSubmit: (parentId: string | null, name: string) => void
}

const AddForm: React.FC<AddFormProps> = ({ parentId, onClose, onSubmit }) => {

    const [name, setName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await onSubmit(parentId, name)
            setName('');
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
                type="text"
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="flex-1 px-4 py-3 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
            />
            <button
                disabled={isSubmitting}
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
                Add
            </button>
            <button
                disabled={isSubmitting}
                type="button"
                onClick={() => {
                    onClose()
                    setName('')
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
                Cancel
            </button>
        </form>
    )
}

export default AddForm