import express from "express";
import webRouter from "../modules/web/web.router.js";
import { limiter } from "../shared/middlewares/rateLimit.js";
const allRoutes= express.Router()

allRoutes.use("/audit",limiter, webRouter);

export default allRoutes;