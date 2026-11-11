import AsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Session from "../models/session.model.mjs";
import Bookmark from "../models/bookmark.model.mjs";
import Expo from "../models/expo.model.mjs";
import { publishRealtimeUpdate } from "../utils/realtime.utils.mjs";

const getAllSessions = AsyncHandler(async (request, response) => {
    const filter = {};

    if (request.query.expo && mongoose.isValidObjectId(request.query.expo)) {
        filter.expo = request.query.expo;
    }

    if (request.query.sessionType && request.query.sessionType !== "All") {
        filter.sessionType = request.query.sessionType;
    }

    const sessions = await Session.find(filter)
        .populate("expo", "title date location theme")
        .sort({ startTime: 1 });

    let bookmarkedSessionIds = new Set();
    if (request.user?._id) {
        const userBookmarks = await Bookmark.find({ attendee: request.user._id }).select("session");
        bookmarkedSessionIds = new Set(userBookmarks.map((b) => b.session.toString()));
    }

    const formattedSessions = sessions.map((s) => {
        const obj = s.toObject();
        obj.isBookmarked = bookmarkedSessionIds.has(s._id.toString());
        return obj;
    });

    return response.status(200).json({
        success: true,
        sessionCount: formattedSessions.length,
        sessions: formattedSessions
    });
});

const getSingleSession = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid session ID.", success: false });
    }

    const session = await Session.findById(id).populate("expo", "title date location");
    if (!session) {
        return response.status(404).json({ message: "Session was not found.", success: false });
    }

    let isBookmarked = false;
    if (request.user?._id) {
        const exists = await Bookmark.exists({ attendee: request.user._id, session: id });
        isBookmarked = Boolean(exists);
    }

    const sessionObj = session.toObject();
    sessionObj.isBookmarked = isBookmarked;

    return response.status(200).json({ success: true, session: sessionObj });
});

const createSession = AsyncHandler(async (request, response) => {
    const { expo, title, topic, speaker, speakerRole, sessionType, location, startTime, endTime } = request.body;

    if (!expo || !mongoose.isValidObjectId(expo)) {
        return response.status(400).json({ message: "Valid expo ID is required.", success: false });
    }
    if (!title || !title.trim()) {
        return response.status(400).json({ message: "Session title is required.", success: false });
    }
    if (!speaker || !speaker.trim()) {
        return response.status(400).json({ message: "Speaker name is required.", success: false });
    }
    if (!location || !location.trim()) {
        return response.status(400).json({ message: "Session location / room is required.", success: false });
    }

    const expoExists = await Expo.exists({ _id: expo });
    if (!expoExists) {
        return response.status(404).json({ message: "Associated expo does not exist.", success: false });
    }

    const newSession = await Session.create({
        expo,
        title: title.trim(),
        topic: (topic || "General Keynote").trim(),
        speaker: speaker.trim(),
        speakerRole: (speakerRole || "Guest Speaker").trim(),
        sessionType: (sessionType || "Keynote").trim(),
        location: location.trim(),
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : new Date(Date.now() + 60 * 60 * 1000)
    });

    const populated = await Session.findById(newSession._id).populate("expo", "title date location");
    publishRealtimeUpdate("session", expo, "created");

    return response.status(201).json({
        message: "Session added to event schedule.",
        success: true,
        session: populated
    });
});

const updateSession = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid session ID.", success: false });
    }

    const updated = await Session.findByIdAndUpdate(
        id,
        { ...request.body },
        { new: true, runValidators: true }
    ).populate("expo", "title date location");

    if (!updated) {
        return response.status(404).json({ message: "Session was not found.", success: false });
    }
    publishRealtimeUpdate("session", updated.expo._id || updated.expo, "updated");

    return response.status(200).json({
        message: "Session schedule updated successfully.",
        success: true,
        session: updated
    });
});

const deleteSession = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid session ID.", success: false });
    }

    const deleted = await Session.findByIdAndDelete(id);
    if (!deleted) {
        return response.status(404).json({ message: "Session was not found.", success: false });
    }

    await Bookmark.deleteMany({ session: id });
    publishRealtimeUpdate("session", deleted.expo, "deleted");

    return response.status(200).json({
        message: "Session removed from schedule.",
        success: true
    });
});

const toggleBookmarkSession = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid session ID.", success: false });
    }

    const sessionExists = await Session.exists({ _id: id });
    if (!sessionExists) {
        return response.status(404).json({ message: "Session was not found.", success: false });
    }

    const existingBookmark = await Bookmark.findOne({
        attendee: request.user._id,
        session: id
    });

    if (existingBookmark) {
        await Bookmark.findByIdAndDelete(existingBookmark._id);
        return response.status(200).json({
            success: true,
            bookmarked: false,
            message: "Session removed from your agenda."
        });
    }

    await Bookmark.create({
        attendee: request.user._id,
        session: id
    });

    return response.status(200).json({
        success: true,
        bookmarked: true,
        message: "Session bookmarked to your personal agenda."
    });
});

const getMyBookmarkedSessions = AsyncHandler(async (request, response) => {
    const bookmarks = await Bookmark.find({ attendee: request.user._id })
        .populate({
            path: "session",
            populate: { path: "expo", select: "title date location theme" }
        })
        .sort({ createdAt: -1 });

    const sessions = bookmarks
        .map((b) => b.session)
        .filter(Boolean)
        .map((s) => {
            const obj = s.toObject ? s.toObject() : s;
            obj.isBookmarked = true;
            return obj;
        });

    return response.status(200).json({
        success: true,
        count: sessions.length,
        sessions
    });
});

export {
    getAllSessions,
    getSingleSession,
    createSession,
    updateSession,
    deleteSession,
    toggleBookmarkSession,
    getMyBookmarkedSessions
};
