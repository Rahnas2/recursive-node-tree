import axiosInstance from "./axiosInstance"

export const createNodeApi = async(name: string, parentId: string | null) => {
        const response = await axiosInstance.post('/api/nodes', {name, parentId})
        return response.data
}

export const getTreeApi = async() => {
    const response = await axiosInstance.get('/api/nodes')
    return response.data
}

export const deleteNodeApi = async(nodeId: string) => {
    const response = await axiosInstance.delete(`/api/nodes/${nodeId}`)
    return response.data
}