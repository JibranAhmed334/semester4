import { Router } from "express";
import {
    registerForExpo,
    getMyRegistrations,
    cancelRegistration
} from "../controllers/registration.controller.mjs";
import varifytoken from "../midlleware/varifymiddleware.mjs";

const registrationRouter = Router();

registrationRouter.use(varifytoken);

registrationRouter.post("/", registerForExpo);
registrationRouter.get("/my", getMyRegistrations);
registrationRouter.patch("/:id/cancel", cancelRegistration);

export default registrationRouter;
