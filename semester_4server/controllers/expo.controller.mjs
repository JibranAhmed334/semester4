import AsyncHandler from "express-async-handler";
import fs from "node:fs/promises";
import mongoose from "mongoose";
import Category from "../models/category.model.mjs";
import Expo from "../models/expo.model.mjs";
import delete_from_cloudinary from "../utils/cloudinary.delete.utils .mjs";
import upload_on_cloudinary from "../utils/cloudinary.utils.mjs";
import { publishRealtimeUpdate } from "../utils/realtime.utils.mjs";

const removeUploadedFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
};

const removeNewUpload = async (file) => {
    if (!file) return;
    try {
        await removeUploadedFile(file.path);
    } catch (error) {
        console.error("Could not remove temporary expo banner:", error.message);
    }
};

const parseExpoDate = (val) => {
    if (val instanceof Date && Number.isFinite(val.getTime())) return val;
    if (typeof val === "string" && val.trim()) {
        const parsed = new Date(val);
        if (Number.isFinite(parsed.getTime())) return parsed;
    }
    return new Date("2026-11-15T09:00:00.000Z");
};

const isValidExpoInput = (input) => {
    const title = input.title || input.product_name;
    const boothCount = Number(input.boothCount ?? input.price ?? 50);

    return Boolean(
        typeof title === "string" && title.trim() &&
        typeof input.location === "string" && input.location.trim() &&
        typeof input.description === "string" && input.description.trim() &&
        mongoose.isValidObjectId(input.category) &&
        Number.isFinite(boothCount) && boothCount >= 0
    );
};

const populateExpo = (query) => query
    .populate("category", "category_name")
    .populate("organizer", "name");

const canManageExpo = (request, expo) =>
    request.user.role === "admin" ||
    request.user.role === "organizer" ||
    request.user.role === "exhibitor" ||
    expo.organizer?.toString() === request.user._id?.toString();

const getAllExpos = AsyncHandler(async (_request, response) => {
    const expos = await populateExpo(Expo.find().sort({ date: 1, createdAt: -1 }));

    return response.status(200).json({
        message: "Expos retrieved successfully.",
        success: true,
        expoCount: expos.length,
        expos,
        products: expos,
        product: expos
    });
});

const createExpo = AsyncHandler(async (request, response) => {
    const title = (request.body.title || request.body.product_name || "").trim();
    const location = (request.body.location || "Metropolitan Convention Center").trim();
    const description = (request.body.description || "International expo showcasing innovative industry developments.").trim();
    const category = request.body.category;
    const theme = (request.body.theme || "").trim();
    const boothCount = Number(request.body.boothCount ?? request.body.price ?? 50);
    const price = Number(request.body.price ?? request.body.boothCount ?? 500);
    const date = parseExpoDate(request.body.date);

    if (!isValidExpoInput({ title, location, description, category, boothCount })) {
        await removeNewUpload(request.file);
        return response.status(400).json({
            message: "Provide a title, valid location, description, category, and booth count or rate.",
            success: false
        });
    }

    if (!await Category.exists({ _id: category })) {
        await removeNewUpload(request.file);
        return response.status(400).json({ message: "The selected category does not exist.", success: false });
    }

    let uploadedBanner;
    if (request.file) {
        try {
            uploadedBanner = await upload_on_cloudinary(request.file.path, "eventsphere/expos");
        } catch (error) {
            await removeNewUpload(request.file);
            console.error("Expo banner upload failed:", error.message);
            return response.status(502).json({
                message: "The expo banner could not be uploaded. Check the image storage configuration and try again.",
                success: false
            });
        }
        await removeNewUpload(request.file);
    }

    const defaultBanner = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800";

    try {
        let expo = await Expo.create({
            title,
            date,
            location,
            description,
            category,
            theme,
            boothCount,
            price,
            bannerUrl: uploadedBanner?.secure_url || defaultBanner,
            bannerPublicId: uploadedBanner?.public_id,
            product_image_url: uploadedBanner?.secure_url || defaultBanner,
            product_image_public_id: uploadedBanner?.public_id,
            organizer: request.user._id
        });
        expo = await populateExpo(Expo.findById(expo._id));
        publishRealtimeUpdate("expo", expo._id, "created");

        return response.status(201).json({
            message: "Expo created successfully.",
            success: true,
            expo,
            product: expo
        });
    } catch (error) {
        if (uploadedBanner?.public_id) {
            try {
                await delete_from_cloudinary(uploadedBanner.public_id);
            } catch (cleanupError) {
                console.error("Could not remove expo banner after create failed:", cleanupError.message);
            }
        }
        throw error;
    }
});

const getSingleExpo = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid expo ID.", success: false });
    }

    const expo = await populateExpo(Expo.findById(id));
    if (!expo) {
        return response.status(404).json({ message: "Expo not found.", success: false });
    }

    return response.status(200).json({
        message: "Expo retrieved successfully.",
        success: true,
        expo,
        product: expo
    });
});

const updateExpo = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        await removeNewUpload(request.file);
        return response.status(400).json({ message: "Invalid expo ID.", success: false });
    }

    const expo = await Expo.findById(id);
    if (!expo) {
        await removeNewUpload(request.file);
        return response.status(404).json({ message: "Expo not found.", success: false });
    }
    if (!canManageExpo(request, expo)) {
        await removeNewUpload(request.file);
        return response.status(403).json({ message: "You can only manage expos that you created.", success: false });
    }

    const title = (request.body.title || request.body.product_name || expo.title).trim();
    const location = (request.body.location || expo.location).trim();
    const description = (request.body.description || expo.description).trim();
    const category = request.body.category || expo.category?.toString();
    const theme = (request.body.theme !== undefined ? request.body.theme : expo.theme) || "";
    const boothCount = Number(request.body.boothCount ?? request.body.price ?? expo.boothCount);
    const price = Number(request.body.price ?? request.body.boothCount ?? expo.price);
    const date = request.body.date ? parseExpoDate(request.body.date) : expo.date;

    if (!isValidExpoInput({ title, location, description, category, boothCount })) {
        await removeNewUpload(request.file);
        return response.status(400).json({
            message: "Provide a valid title, location, description, category, and booth count or rate.",
            success: false
        });
    }

    if (!await Category.exists({ _id: category })) {
        await removeNewUpload(request.file);
        return response.status(400).json({ message: "The selected category does not exist.", success: false });
    }

    let uploadedBanner;
    if (request.file) {
        try {
            uploadedBanner = await upload_on_cloudinary(request.file.path, "eventsphere/expos");
        } catch (error) {
            await removeNewUpload(request.file);
            console.error("Expo banner replacement failed:", error.message);
            return response.status(502).json({
                message: "The new expo banner could not be uploaded. Check the image storage configuration and try again.",
                success: false
            });
        }
        await removeNewUpload(request.file);
    }

    const updateData = {
        title,
        date,
        location,
        description,
        category,
        theme,
        boothCount,
        price
    };

    if (uploadedBanner) {
        updateData.bannerUrl = uploadedBanner.secure_url;
        updateData.bannerPublicId = uploadedBanner.public_id;
        updateData.product_image_url = uploadedBanner.secure_url;
        updateData.product_image_public_id = uploadedBanner.public_id;
    }

    try {
        const updatedExpo = await Expo.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (uploadedBanner?.public_id && expo.bannerPublicId) {
            try {
                await delete_from_cloudinary(expo.bannerPublicId);
            } catch (error) {
                console.error("Could not remove replaced expo banner:", error.message);
            }
        }

        const populated = await populateExpo(Expo.findById(updatedExpo._id));
        publishRealtimeUpdate("expo", populated._id, "updated");

        return response.status(200).json({
            message: "Expo updated successfully.",
            success: true,
            expo: populated,
            product: populated
        });
    } catch (error) {
        if (uploadedBanner?.public_id) {
            try {
                await delete_from_cloudinary(uploadedBanner.public_id);
            } catch (cleanupError) {
                console.error("Could not remove new expo banner after update failed:", cleanupError.message);
            }
        }
        throw error;
    }
});

const deleteExpo = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid expo ID.", success: false });
    }

    const expo = await Expo.findById(id);
    if (!expo) {
        return response.status(404).json({ message: "Expo not found.", success: false });
    }
    if (!canManageExpo(request, expo)) {
        return response.status(403).json({ message: "You can only manage expos that you created.", success: false });
    }

    await Expo.findByIdAndDelete(id);
    publishRealtimeUpdate("expo", id, "deleted");

    let warning;
    if (expo.bannerPublicId) {
        try {
            await delete_from_cloudinary(expo.bannerPublicId);
        } catch (error) {
            console.error(`Could not remove banner for deleted expo ${id}:`, error.message);
            warning = "Expo was deleted, but its banner could not be removed from image storage.";
        }
    }

    return response.status(200).json({
        message: "Expo deleted successfully.",
        success: true,
        warning
    });
});

export {
    getAllExpos,
    createExpo,
    getSingleExpo,
    updateExpo,
    deleteExpo
};
