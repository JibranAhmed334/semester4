import { Router } from "express";
import {
    getAllSessions,
    getSingleSession,
    createSession,
    updateSession,
    deleteSession,
    toggleBookmarkSession,
    getMyBookmarkedSessions
} from "../controllers/session.controller.mjs";
import varifytoken from "../midlleware/varifymiddleware.mjs";
import roleMiddleware from "../midlleware/RoleMiddleware.mjs";
import optionalAuth from "../midlleware/optionalAuth.mjs";

const sessionRouter = Router();

sessionRouter.get("/", optionalAuth, getAllSessions);
sessionRouter.get("/my-bookmarks", varifytoken, getMyBookmarkedSessions);
sessionRouter.get("/:id", optionalAuth, getSingleSession);
sessionRouter.post("/:id/bookmark", varifytoken, toggleBookmarkSession);

sessionRouter.post("/", varifytoken, roleMiddleware("admin", "organizer"), createSession);
sessionRouter.put("/:id", varifytoken, roleMiddleware("admin", "organizer"), updateSession);
sessionRouter.delete("/:id", varifytoken, roleMiddleware("admin", "organizer"), deleteSession);

export default sessionRouter;
