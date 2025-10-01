import mongoose from "mongoose"

const mongoUri = process.env.MONGO_URI || ''
export const connectMongooseDB = async (): Promise<void> => {
    try {
        await mongoose.connect(mongoUri)
        console.log('db connected successfully')
    } catch (error) {
        console.error('db connection error ', error)
        process.exit(1)
    }
    
}