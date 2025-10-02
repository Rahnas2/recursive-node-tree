import React from "react";

interface TreeSkeletonProps {
    count?: number
}

const TreeSkeleton: React.FC<TreeSkeletonProps> = ({count = 5 }) => {
    return (
        <div className="space-y-2 bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex flex-col ">
                    <div
                        className={`flex items-center gap-2 py-2 px-3 mb-2`}
                    >
                        <div className="w-6 h-6 bg-gray-300 rounded flex-shrink-0"></div>
                        <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TreeSkeleton
