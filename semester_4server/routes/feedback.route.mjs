import { Router } from "express";
import {
    createFeedback,
    getFeedback,
    updateFeedbackStatus
} from "../controllers/feedback.controller.mjs";
import roleMiddleware from "../midlleware/RoleMiddleware.mjs";
import varifytoken from "../midlleware/varifymiddleware.mjs";

const feedbackRouter = Router();

feedbackRouter.use(varifytoken);
feedbackRouter.get("/", getFeedback);
feedbackRouter.post("/", createFeedback);
feedbackRouter.patch("/:id/status", roleMiddleware("admin", "organizer"), updateFeedbackStatus);

export default feedbackRouter;
