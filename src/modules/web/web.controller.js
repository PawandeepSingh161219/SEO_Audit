import { AppError } from "../../shared/utils/error.js";
import { validationResult } from "express-validator";
import { seoAudit } from "./web.service.js";
export const seoController = async (req, res) => {
     const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            res.status(400).json({
                status: "failed",
                message: errorMessages
            });
            return;
        }
    const {url} = req.body;
    const auditReport = await seoAudit(url);

      res.json({
            success: true,
            data: auditReport
        });


    if(!url){
        throw new AppError("URL is required", 400);
    }
    console.log("URL is: ", url);
    
}