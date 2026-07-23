import express from "express";
import { seoController } from "./web.controller.js";
import { validateUrl } from "./web.validator.js";


const webRouter= express.Router()
webRouter.post("/", validateUrl, seoController);


export default webRouter;