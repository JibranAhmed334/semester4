import AsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Category from "../models/category.model.mjs";
import Expo from "../models/expo.model.mjs";
import Exhibitor from "../models/exhibitor.model.mjs";
import ExhibitorApplication from "../models/exhibitorApplication.model.mjs";

const normalizeList = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 20);
    }
    if (typeof value === "string") {
        return value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 20);
    }
    return [];
};

const normalizeDocuments = (value) => {
    if (!Array.isArray(value)) return null;
    if (value.length > 10) return null;

    const documents = [];
    for (const item of value) {
        if (!item || typeof item.url !== "string" || !/^https?:\/\/\S+$/i.test(item.url.trim())) {
            return null;
        }
        const url = item.url.trim();
        const name = typeof item.name === "string" && item.name.trim()
            ? item.name.trim().slice(0, 120)
            : `Supporting document ${documents.length + 1}`;
        documents.push({ name, url });
    }
    return documents;
};

const getDirectory = AsyncHandler(async (request, response) => {
    const filter = {};
    if (request.query.category && mongoose.isValidObjectId(request.query.category)) {
        filter.category = request.query.category;
    }
    if (typeof request.query.search === "string" && request.query.search.trim()) {
        const search = request.query.search.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { companyName: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { products: { $regex: search, $options: "i" } },
            { services: { $regex: search, $options: "i" } }
        ];
    }

    const exhibitors = await Exhibitor.find(filter)
        .select("companyName products services description category logo contactEmail contactPhone website")
        .populate("category", "category_name")
        .sort({ companyName: 1 })
        .limit(100);

    return response.status(200).json({ success: true, exhibitorCount: exhibitors.length, exhibitors });
});

const getMyProfile = AsyncHandler(async (request, response) => {
    const exhibitor = await Exhibitor.findOne({ user: request.user._id })
        .populate("category", "category_name");
    return response.status(200).json({ success: true, exhibitor });
});

const saveMyProfile = AsyncHandler(async (request, response) => {
    const { companyName, contactEmail, contactPhone, description, category, website, logo } = request.body;
    const cleanCompanyName = typeof companyName === "string" ? companyName.trim() : "";
    const cleanContactEmail = typeof contactEmail === "string" ? contactEmail.trim().toLowerCase() : "";
    const cleanDescription = typeof description === "string" ? description.trim() : "";

    if (!cleanCompanyName || !cleanContactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanContactEmail)) {
        return response.status(400).json({ message: "Provide a company name and valid contact email.", success: false });
    }
    if (cleanCompanyName.length > 120 || cleanDescription.length > 2000) {
        return response.status(400).json({ message: "Company name must be 120 characters or fewer and description 2,000 characters or fewer.", success: false });
    }
    if (category && !mongoose.isValidObjectId(category)) {
        return response.status(400).json({ message: "Choose a valid company category.", success: false });
    }
    if (category && !await Category.exists({ _id: category })) {
        return response.status(400).json({ message: "The selected category does not exist.", success: false });
    }
    if (website && (typeof website !== "string" || !/^https?:\/\/\S+$/i.test(website.trim()))) {
        return response.status(400).json({ message: "Website must start with http:// or https://.", success: false });
    }

    const update = {
        companyName: cleanCompanyName,
        contactEmail: cleanContactEmail,
        contactPhone: typeof contactPhone === "string" ? contactPhone.trim().slice(0, 40) : "",
        description: cleanDescription,
        category: category || null,
        website: typeof website === "string" ? website.trim() : "",
        logo: typeof logo === "string" ? logo.trim().slice(0, 500) : "",
        products: normalizeList(request.body.products),
        services: normalizeList(request.body.services),
        user: request.user._id
    };

    const exhibitor = await Exhibitor.findOneAndUpdate(
        { user: request.user._id },
        { $set: update },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate("category", "category_name");

    return response.status(200).json({
        message: "Exhibitor profile saved.",
        success: true,
        exhibitor
    });
});

const getApplications = AsyncHandler(async (request, response) => {
    const isStaff = ["admin", "organizer"].includes(request.user.role);
    let filter;

    if (request.user.role === "admin") {
        filter = {};
    } else if (request.user.role === "organizer") {
        const ownedExpos = await Expo.find({ organizer: request.user._id }).select("_id");
        filter = { expo: { $in: ownedExpos.map((expo) => expo._id) } };
    } else {
        const exhibitor = await Exhibitor.findOne({ user: request.user._id }).select("_id");
        if (!exhibitor) {
            return response.status(200).json({ success: true, applications: [] });
        }
        filter = { exhibitor: exhibitor._id };
    }

    const applications = await ExhibitorApplication.find(filter)
        .populate("exhibitor", "companyName contactEmail contactPhone")
        .populate("expo", "title date location organizer")
        .sort({ createdAt: -1 })
        .limit(200);

    return response.status(200).json({ success: true, applications, isStaff });
});

const applyForExpo = AsyncHandler(async (request, response) => {
    if (request.user.role !== "exhibitor") {
        return response.status(403).json({ message: "Only exhibitor accounts can apply to expos.", success: false });
    }
    const { expoId } = request.body;
    if (!mongoose.isValidObjectId(expoId)) {
        return response.status(400).json({ message: "Choose a valid expo.", success: false });
    }

    const exhibitor = await Exhibitor.findOne({ user: request.user._id });
    if (!exhibitor) {
        return response.status(400).json({ message: "Complete your company profile before applying to an expo.", success: false });
    }
    if (!await Expo.exists({ _id: expoId })) {
        return response.status(404).json({ message: "Expo not found.", success: false });
    }
    const documents = normalizeDocuments(request.body.documents ?? []);
    if (!documents) {
        return response.status(400).json({
            message: "Provide up to 10 supporting document URLs, each starting with http:// or https://.",
            success: false
        });
    }

    const previousApplication = await ExhibitorApplication.findOne({
        exhibitor: exhibitor._id,
        expo: expoId
    });
    if (previousApplication) {
        if (previousApplication.status !== "rejected") {
            return response.status(409).json({
                message: `Your application is already ${previousApplication.status}.`,
                success: false
            });
        }

        previousApplication.status = "pending";
        previousApplication.applicationDate = new Date();
        previousApplication.documents = documents;
        await previousApplication.save();
        const application = await ExhibitorApplication.findById(previousApplication._id)
            .populate("exhibitor", "companyName contactEmail")
            .populate("expo", "title date location");

        return response.status(200).json({
            message: "Your application has been resubmitted for review.",
            success: true,
            application
        });
    }

    try {
        const application = await ExhibitorApplication.create({
            exhibitor: exhibitor._id,
            expo: expoId,
            documents
        });
        const populatedApplication = await ExhibitorApplication.findById(application._id)
            .populate("exhibitor", "companyName contactEmail")
            .populate("expo", "title date location");

        return response.status(201).json({
            message: "Expo application submitted.",
            success: true,
            application: populatedApplication
        });
    } catch (error) {
        if (error.code === 11000) {
            return response.status(409).json({ message: "Your company has already applied to this expo.", success: false });
        }
        throw error;
    }
});

const updateApplicationStatus = AsyncHandler(async (request, response) => {
    const { id } = request.params;
    const { status } = request.body;
    if (!mongoose.isValidObjectId(id)) {
        return response.status(400).json({ message: "Invalid application ID.", success: false });
    }
    if (!["approved", "rejected"].includes(status)) {
        return response.status(400).json({ message: "Choose approved or rejected.", success: false });
    }

    const application = await ExhibitorApplication.findById(id).populate("expo", "organizer");
    if (!application) {
        return response.status(404).json({ message: "Application not found.", success: false });
    }
    if (!application.expo) {
        return response.status(404).json({ message: "The expo for this application no longer exists.", success: false });
    }
    if (request.user.role !== "admin"
        && application.expo.organizer.toString() !== request.user._id.toString()) {
        return response.status(403).json({ message: "You can only review applications for your expos.", success: false });
    }

    application.status = status;
    await application.save();

    return response.status(200).json({
        message: `Application ${status}.`,
        success: true,
        application: await ExhibitorApplication.findById(application._id)
            .populate("exhibitor", "companyName contactEmail contactPhone")
            .populate("expo", "title date location")
    });
});

export {
    applyForExpo,
    getApplications,
    getDirectory,
    getMyProfile,
    saveMyProfile,
    updateApplicationStatus
};
