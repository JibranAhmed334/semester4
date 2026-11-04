import { Router } from "express";
import {
    applyForExpo,
    getApplications,
    getDirectory,
    getMyProfile,
    saveMyProfile,
    updateApplicationStatus
} from "../controllers/exhibitor.controller.mjs";
import roleMiddleware from "../midlleware/RoleMiddleware.mjs";
import varifytoken from "../midlleware/varifymiddleware.mjs";

const exhibitorRouter = Router();

exhibitorRouter.get("/", getDirectory);
exhibitorRouter.get("/me", varifytoken, roleMiddleware("exhibitor"), getMyProfile);
exhibitorRouter.put("/me", varifytoken, roleMiddleware("exhibitor"), saveMyProfile);
exhibitorRouter.get("/applications", varifytoken, roleMiddleware("exhibitor", "admin", "organizer"), getApplications);
exhibitorRouter.post("/applications", varifytoken, roleMiddleware("exhibitor"), applyForExpo);
exhibitorRouter.patch("/applications/:id", varifytoken, roleMiddleware("admin", "organizer"), updateApplicationStatus);

export default exhibitorRouter;
