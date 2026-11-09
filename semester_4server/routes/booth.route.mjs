import { Router } from "express";
import {
    getAllBooths,
    getSingleBooth,
    reserveBooth,
    updateBoothDetails,
    getMyReservedBooths,
    createBooth,
    deleteBooth
} from "../controllers/booth.controller.mjs";
import roleMiddleware from "../midlleware/RoleMiddleware.mjs";
import varifytoken from "../midlleware/varifymiddleware.mjs";

const boothRouter = Router();

boothRouter.get("/", getAllBooths);
boothRouter.get("/my", varifytoken, roleMiddleware("exhibitor", "admin", "organizer"), getMyReservedBooths);
boothRouter.get("/:id", getSingleBooth);
boothRouter.post("/:id/reserve", varifytoken, roleMiddleware("exhibitor", "admin", "organizer"), reserveBooth);
boothRouter.put("/:id", varifytoken, updateBoothDetails);
boothRouter.post("/", varifytoken, roleMiddleware("admin", "organizer"), createBooth);
boothRouter.delete("/:id", varifytoken, roleMiddleware("admin", "organizer"), deleteBooth);

export default boothRouter;
