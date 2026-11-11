import AsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Registration from "../models/registration.model.mjs";
import Expo from "../models/expo.model.mjs";

const registerForExpo = AsyncHandler(async (request, response) => {
    const { expoId } = request.body;

    if (!expoId || !mongoose.isValidObjectId(expoId)) {
        return response.status(400).json({ message: "A valid expo ID is required.", success: false });
    }

    const expo = await Expo.findById(expoId);
    if (!expo) {
        return response.status(404).json({ message: "Expo event was not found.", success: false });
    }

    const existing = await Registration.findOne({
        attendee: request.user._id,
        expo: expoId,
        status: "registered"
    }).populate("expo", "title date location theme");

    if (existing) {
        return response.status(200).json({
            message: `You are already registered for "${expo.title}".`,
            success: true,
            alreadyRegistered: true,
            registration: existing
        });
    }

    const registration = await Registration.create({
        attendee: request.user._id,
        expo: expoId,
        status: "registered",
        registrationDate: new Date()
    });

    const populated = await Registration.findById(registration._id).populate("expo", "title date location theme");

    return response.status(201).json({
        message: `Pass confirmed! You are registered for "${expo.title}".`,
        success: true,
        registration: populated
    });
});

const getMyRegistrations = AsyncHandler(async (request, response) => {
    const registrations = await Registration.find({
        attendee: request.user._id,
        status: "registered"
    })
        .populate("expo", "title date location theme bannerUrl boothCount")
        .sort({ createdAt: -1 });

    return response.status(200).json({
        success: true,
        count: registrations.length,
        registrations
    });
});

const cancelRegistration = AsyncHandler(async (request, response) => {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid registration ID.", success: false });
    }

    const registration = await Registration.findOneAndUpdate(
        { _id: id, attendee: request.user._id },
        { status: "cancelled" },
        { new: true }
    );

    if (!registration) {
        return response.status(404).json({ message: "Active registration was not found.", success: false });
    }

    return response.status(200).json({
        message: "Registration pass cancelled successfully.",
        success: true
    });
});

export {
    registerForExpo,
    getMyRegistrations,
    cancelRegistration
};
