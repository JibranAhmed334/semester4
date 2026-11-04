import { Router } from "express";
import {
    getConversation,
    getConversations,
    getMessageContacts,
    sendMessage
} from "../controllers/message.controller.mjs";
import varifytoken from "../midlleware/varifymiddleware.mjs";

const messageRouter = Router();

messageRouter.use(varifytoken);
messageRouter.get("/contacts", getMessageContacts);
messageRouter.get("/conversations", getConversations);
messageRouter.get("/:userId", getConversation);
messageRouter.post("/", sendMessage);

export default messageRouter;
