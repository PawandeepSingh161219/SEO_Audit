import express from "express";
import allRoutes from "./src/routes/all.routes.js";
import { errorHandler } from "./src/shared/middlewares/error.middleware.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

 
app.use("/api/v1", allRoutes);

// Global error handling middleware
app.use(errorHandler);
export default app;