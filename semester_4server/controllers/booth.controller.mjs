import AsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Booth from "../models/booth.model.mjs";
import Expo from "../models/expo.model.mjs";
import Exhibitor from "../models/exhibitor.model.mjs";
import { publishRealtimeUpdate } from "../utils/realtime.utils.mjs";

const populateBooth = (query) => query
    .populate("expo", "title date location theme")
    .populate("exhibitor", "companyName logo contactEmail contactPhone website products services")
    .populate("reservedBy", "name email role");

const getAllBooths = AsyncHandler(async (request, response) => {
    const filter = {};

    if (request.query.expo) {
        if (!mongoose.isValidObjectId(request.query.expo)) {
            return response.status(400).json({ message: "Invalid expo ID.", success: false });
        }
        filter.expo = request.query.expo;
    }

    if (request.query.hall && request.query.hall !== "All") {
        filter.hall = String(request.query.hall).trim();
    }

    if (request.query.status && request.query.status !== "All") {
        const normalizedStatus = String(request.query.status).trim().toLowerCase();
        if (["available", "reserved", "occupied"].includes(normalizedStatus)) {
            filter.status = normalizedStatus;
        }
    }

    const booths = await populateBooth(Booth.find(filter).sort({ hall: 1, boothNumber: 1 }));

    return response.status(200).json({
        message: "Booths retrieved successfully.",
        success: true,
        boothCount: booths.length,
        booths
    });
});

const getSingleBooth = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid booth ID.", success: false });
    }

    const booth = await populateBooth(Booth.findById(id));
    if (!booth) {
        return response.status(404).json({ message: "Booth space was not found.", success: false });
    }

    return response.status(200).json({
        message: "Booth details retrieved.",
        success: true,
        booth
    });
});

const reserveBooth = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid booth ID.", success: false });
    }

    const booth = await Booth.findById(id);
    if (!booth) {
        return response.status(404).json({ message: "Booth space was not found.", success: false });
    }

    if (booth.status !== "available") {
        return response.status(400).json({
            message: `Booth ${booth.boothNumber} is currently ${booth.status}. Please choose an available stall.`,
            success: false
        });
    }

    // Find or link the Exhibitor profile for this user
    let exhibitor = await Exhibitor.findOne({ user: request.user._id });
    if (!exhibitor) {
        // Create a default profile if the exhibitor user has not filled out full profile yet
        exhibitor = await Exhibitor.create({
            companyName: request.user.name || "Exhibiting Brand",
            contactEmail: request.user.email,
            user: request.user._id
        });
    }

    const showcaseDetails = typeof request.body.showcaseDetails === "string"
        ? request.body.showcaseDetails.trim().slice(0, 1000)
        : "";
    const staffInfo = typeof request.body.staffInfo === "string"
        ? request.body.staffInfo.trim().slice(0, 500)
        : "";

    booth.status = "reserved";
    booth.exhibitor = exhibitor._id;
    booth.reservedBy = request.user._id;
    if (showcaseDetails) booth.showcaseDetails = showcaseDetails;
    if (staffInfo) booth.staffInfo = staffInfo;

    await booth.save();

    const populatedBooth = await populateBooth(Booth.findById(booth._id));
    publishRealtimeUpdate("booth", booth.expo, "updated");

    return response.status(200).json({
        message: `Booth ${booth.boothNumber} reserved successfully for ${exhibitor.companyName}!`,
        success: true,
        booth: populatedBooth
    });
});

const updateBoothDetails = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid booth ID.", success: false });
    }

    const booth = await Booth.findById(id);
    if (!booth) {
        return response.status(404).json({ message: "Booth space was not found.", success: false });
    }

    const isStaff = ["admin", "organizer"].includes(request.user.role);
    const isOwner = booth.reservedBy?.toString() === request.user._id.toString();

    if (!isStaff && !isOwner) {
        return response.status(403).json({
            message: "You are not authorized to update this booth.",
            success: false
        });
    }

    // Exhibitor can update their showcased products/services and staff info
    if (request.body.showcaseDetails !== undefined) {
        booth.showcaseDetails = String(request.body.showcaseDetails).trim().slice(0, 1000);
    }
    if (request.body.staffInfo !== undefined) {
        booth.staffInfo = String(request.body.staffInfo).trim().slice(0, 500);
    }

    // Admin / Organizer can update allocation, status, dimensions, rates
    if (isStaff) {
        if (request.body.status) {
            const normalizedStatus = String(request.body.status).trim().toLowerCase();
            if (["available", "reserved", "occupied"].includes(normalizedStatus)) {
                booth.status = normalizedStatus;
                if (normalizedStatus === "available") {
                    booth.exhibitor = undefined;
                    booth.reservedBy = undefined;
                    booth.showcaseDetails = undefined;
                    booth.staffInfo = undefined;
                }
            } else {
                return response.status(400).json({ message: "Invalid status value.", success: false });
            }
        }

        if (request.body.boothNumber) {
            booth.boothNumber = String(request.body.boothNumber).trim();
        }
        if (request.body.location) {
            booth.location = String(request.body.location).trim();
        }
        if (request.body.hall) {
            booth.hall = String(request.body.hall).trim();
        }
        if (request.body.size) {
            booth.size = String(request.body.size).trim();
        }
        if (request.body.price !== undefined && Number(request.body.price) >= 0) {
            booth.price = Number(request.body.price);
        }
        if (request.body.exhibitor !== undefined) {
            if (request.body.exhibitor === null || request.body.exhibitor === "") {
                booth.exhibitor = undefined;
                booth.reservedBy = undefined;
                booth.status = "available";
            } else if (mongoose.isValidObjectId(request.body.exhibitor)) {
                booth.exhibitor = request.body.exhibitor;
                booth.status = "occupied";
            }
        }
    }

    await booth.save();

    const populatedBooth = await populateBooth(Booth.findById(booth._id));
    publishRealtimeUpdate("booth", booth.expo, "updated");

    return response.status(200).json({
        message: `Booth ${booth.boothNumber} updated successfully.`,
        success: true,
        booth: populatedBooth
    });
});

const getMyReservedBooths = AsyncHandler(async (request, response) => {
    const booths = await populateBooth(
        Booth.find({ reservedBy: request.user._id }).sort({ createdAt: -1 })
    );

    return response.status(200).json({
        success: true,
        boothCount: booths.length,
        booths
    });
});

const createBooth = AsyncHandler(async (request, response) => {
    const { boothNumber, location, hall = "Hall A", size = "10x10 ft", price = 1200, expo } = request.body;

    if (!boothNumber || !String(boothNumber).trim()) {
        return response.status(400).json({ message: "Booth number is required.", success: false });
    }
    if (!location || !String(location).trim()) {
        return response.status(400).json({ message: "Location description is required.", success: false });
    }
    if (!expo || !mongoose.isValidObjectId(expo)) {
        return response.status(400).json({ message: "Valid Expo ID is required.", success: false });
    }

    const expoExists = await Expo.exists({ _id: expo });
    if (!expoExists) {
        return response.status(404).json({ message: "Expo does not exist.", success: false });
    }

    const existing = await Booth.findOne({ expo, boothNumber: String(boothNumber).trim() });
    if (existing) {
        return response.status(400).json({
            message: `Booth ${boothNumber} already exists for this expo.`,
            success: false
        });
    }

    const booth = await Booth.create({
        boothNumber: String(boothNumber).trim(),
        location: String(location).trim(),
        hall: String(hall).trim(),
        size: String(size).trim(),
        price: Number(price) >= 0 ? Number(price) : 1200,
        status: "available",
        expo
    });

    const populatedBooth = await populateBooth(Booth.findById(booth._id));
    publishRealtimeUpdate("booth", booth.expo, "created");

    return response.status(201).json({
        message: `Booth ${booth.boothNumber} created successfully.`,
        success: true,
        booth: populatedBooth
    });
});

const deleteBooth = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid booth ID.", success: false });
    }

    const booth = await Booth.findByIdAndDelete(id);
    if (!booth) {
        return response.status(404).json({ message: "Booth was not found.", success: false });
    }

    publishRealtimeUpdate("booth", booth.expo, "deleted");

    return response.status(200).json({
        message: `Booth ${booth.boothNumber} deleted successfully.`,
        success: true
    });
});

export {
    getAllBooths,
    getSingleBooth,
    reserveBooth,
    updateBoothDetails,
    getMyReservedBooths,
    createBooth,
    deleteBooth
};
