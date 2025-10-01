import express from "express";
import dotenv from 'dotenv'
dotenv.config()
import cors from "cors";
import nodeRoutes from "./routes/nodeRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { connectMongooseDB } from "../infrastructure/config/mongoose.config";


const app = express();
const PORT = process.env.PORT || 8080

app.use(cors());
app.use(express.json());

app.use("/api/nodes", nodeRoutes);

app.use(errorHandler)

export async function startServer() {
  await connectMongooseDB()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}