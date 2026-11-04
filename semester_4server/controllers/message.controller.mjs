import AsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Message from "../models/message.model.mjs";
import User from "../models/user.model.mjs";

const getMessageContacts = AsyncHandler(async (request, response) => {
    const contacts = await User.find({ _id: { $ne: request.user._id } })
        .select("name role")
        .sort({ name: 1 });

    return response.status(200).json({ success: true, contacts });
});

const getConversations = AsyncHandler(async (request, response) => {
    const messages = await Message.find({
        $or: [{ sender: request.user._id }, { receiver: request.user._id }]
    })
        .sort({ createdAt: -1 })
        .limit(500)
        .populate("sender", "name role")
        .populate("receiver", "name role");

    const conversations = new Map();
    for (const message of messages) {
        const otherUser = message.sender._id.equals(request.user._id)
            ? message.receiver
            : message.sender;
        const key = otherUser._id.toString();
        if (!conversations.has(key)) {
            conversations.set(key, { contact: otherUser, lastMessage: message });
        }
    }

    return response.status(200).json({
        success: true,
        conversations: [...conversations.values()]
    });
});

const getConversation = AsyncHandler(async (request, response) => {
    const { userId } = request.params;
    if (!mongoose.isValidObjectId(userId)) {
        return response.status(400).json({ message: "Invalid contact ID.", success: false });
    }

    const contact = await User.findById(userId).select("name role");
    if (!contact) {
        return response.status(404).json({ message: "This account was not found.", success: false });
    }

    const messages = await Message.find({
        $or: [
            { sender: request.user._id, receiver: userId },
            { sender: userId, receiver: request.user._id }
        ]
    })
        .sort({ createdAt: 1 })
        .limit(200)
        .populate("sender", "name role")
        .populate("receiver", "name role");

    const conversation = messages.map((message) => ({
        ...message.toObject(),
        isMine: message.sender._id.equals(request.user._id)
    }));

    return response.status(200).json({ success: true, contact, messages: conversation });
});

const sendMessage = AsyncHandler(async (request, response) => {
    const receiverId = request.body.receiverId;
    const messageText = typeof request.body.messageText === "string"
        ? request.body.messageText.trim()
        : "";

    if (!mongoose.isValidObjectId(receiverId)) {
        return response.status(400).json({ message: "Choose a valid recipient.", success: false });
    }
    if (receiverId === request.user._id.toString()) {
        return response.status(400).json({ message: "You cannot send a message to yourself.", success: false });
    }
    if (!messageText) {
        return response.status(400).json({ message: "Write a message before sending.", success: false });
    }
    if (messageText.length > 2000) {
        return response.status(400).json({ message: "Messages must be 2,000 characters or fewer.", success: false });
    }
    if (!await User.exists({ _id: receiverId })) {
        return response.status(404).json({ message: "The recipient account was not found.", success: false });
    }

    let message = await Message.create({
        sender: request.user._id,
        receiver: receiverId,
        messageText
    });
    message = await Message.findById(message._id)
        .populate("sender", "name role")
        .populate("receiver", "name role");

    return response.status(201).json({
        message: "Message sent.",
        success: true,
        data: { ...message.toObject(), isMine: true }
    });
});

export { getConversation, getConversations, getMessageContacts, sendMessage };
