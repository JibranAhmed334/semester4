import AsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Feedback from "../models/feedback.model.mjs";

const createFeedback = AsyncHandler(async (request, response) => {
    const subject = typeof request.body.subject === "string" ? request.body.subject.trim() : "";
    const message = typeof request.body.message === "string" ? request.body.message.trim() : "";

    if (!subject || !message) {
        return response.status(400).json({ message: "Subject and message are required.", success: false });
    }
    if (subject.length > 120 || message.length > 3000) {
        return response.status(400).json({ message: "Subject must be 120 characters or fewer and message 3,000 characters or fewer.", success: false });
    }

    const feedback = await Feedback.create({
        user: request.user._id,
        subject,
        message
    });

    return response.status(201).json({
        message: "Your support request has been submitted.",
        success: true,
        feedback
    });
});

const getFeedback = AsyncHandler(async (request, response) => {
    const isStaff = ["admin", "organizer"].includes(request.user.role);
    const feedback = await Feedback.find(isStaff ? {} : { user: request.user._id })
        .populate("user", "name email role")
        .sort({ createdAt: -1 })
        .limit(200);

    return response.status(200).json({ success: true, feedback });
});

const updateFeedbackStatus = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    const { status } = request.body;

    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid feedback ID.", success: false });
    }
    if (!["pending", "in-progress", "resolved"].includes(status)) {
        return response.status(400).json({ message: "Choose a valid feedback status.", success: false });
    }

    const feedback = await Feedback.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    ).populate("user", "name email role");

    if (!feedback) {
        return response.status(404).json({ message: "Feedback was not found.", success: false });
    }

    return response.status(200).json({ message: "Feedback status updated.", success: true, feedback });
});

export { createFeedback, getFeedback, updateFeedbackStatus };
