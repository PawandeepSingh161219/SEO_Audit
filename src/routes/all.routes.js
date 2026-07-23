import express from "express";
import webRouter from "../modules/web/web.router.js";

const allRoutes= express.Router()

allRoutes.use("/audit", webRouter);

export default allRoutes;