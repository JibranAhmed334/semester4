import { Router } from "express";
import {
    createExpo,
    deleteExpo,
    getAllExpos,
    getSingleExpo,
    updateExpo
} from "../controllers/expo.controller.mjs";
import roleMiddleware from "../midlleware/RoleMiddleware.mjs";
import uploads from "../midlleware/uplods.mjs";
import varifytoken from "../midlleware/varifymiddleware.mjs";

const uploadAnyBanner = (req, res, next) => {
    uploads.any()(req, res, (err) => {
        if (err) return next(err);
        if (req.files && req.files.length > 0) {
            req.file = req.files[0];
        }
        next();
    });
};

const expoRouter = Router();

expoRouter.get("/", getAllExpos);
expoRouter.get("/:id", getSingleExpo);
expoRouter.post("/", varifytoken, roleMiddleware("admin", "organizer", "exhibitor"), uploadAnyBanner, createExpo);
expoRouter.put("/:id", varifytoken, roleMiddleware("admin", "organizer", "exhibitor"), uploadAnyBanner, updateExpo);
expoRouter.patch("/:id", varifytoken, roleMiddleware("admin", "organizer", "exhibitor"), uploadAnyBanner, updateExpo);
expoRouter.delete("/:id", varifytoken, roleMiddleware("admin", "organizer", "exhibitor"), deleteExpo);

export default expoRouter;
