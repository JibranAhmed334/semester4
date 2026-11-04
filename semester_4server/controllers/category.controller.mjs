import AsyncHandler from "express-async-handler";
import Category from "../models/category.model.mjs";
import Expo from "../models/expo.model.mjs";
import mongoose from "mongoose";

const defaultExpoCategories = [
    "Technology & AI",
    "Healthcare & MedTech",
    "Automotive & EV",
    "Green Energy",
    "Retail & E-Commerce",
    "Industrial Machinery"
];

const getAllCategories = AsyncHandler(async (req, res) => {
    let categories = await Category.find().sort({ createdAt: -1 });

    if (categories.length === 0) {
        try {
            await Category.insertMany(
                defaultExpoCategories.map((name) => ({ category_name: name.toLowerCase() }))
            );
            categories = await Category.find().sort({ createdAt: -1 });
        } catch (e) {
            console.error("Auto category seed warning:", e.message);
        }
    }

    return res.status(200).json({
        message: "get all categories",
        success: true,
        data: categories
    });
});

const createCategory = AsyncHandler(async (req, res) => {
    const categoryName = req.body.category_name ?? req.body.Category_name ?? req.body.categoryName ?? req.body.catogery_name ?? req.body.catogeryname;

    if (!categoryName) {
        return res.status(400).json({
            message: "please category provided",
            success: false
        });
    }

    const categoryExists = await Category.findOne({ category_name: categoryName.trim().toLowerCase() });
    if (categoryExists) {
        return res.status(409).json({
            message: "category already exists",
            success: false
        });
    }

    const category = await Category.create({ category_name: categoryName.trim().toLowerCase() });
    return res.status(201).json({
        message: "create categories",
        success: true,
        category
    });
});

const getSingleCategory = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({
            message: "category does not exist",
            success: false
        });
    }

    return res.status(200).json({
        message: "get single categories",
        success: true,
        category
    });
});

const updateCategory = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid category id.", success: false });
    }

    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({
            message: "category does not exist",
            success: false
        });
    }

    const categoryName = req.body.category_name?.trim();
    if (!categoryName) {
        return res.status(400).json({ message: "Please provide a category name.", success: false });
    }

    const duplicateCategory = await Category.findOne({
        category_name: categoryName.toLowerCase(),
        _id: { $ne: id }
    });

    if (duplicateCategory) {
        return res.status(409).json({ message: "Category already exists.", success: false });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { category_name: categoryName.toLowerCase() },
        { new: true, runValidators: true }
    );

    return res.status(200).json({
        message: "update categories",
        success: true,
        updatedCategory
    });
});

const deleteCategory = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid category id.", success: false });
    }

    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({
            message: "category does not exist",
            success: false
        });
    }

    const exposUsingCategory = await Expo.exists({ category: id });
    if (exposUsingCategory) {
        return res.status(409).json({
            message: "Move or delete this category's expos before removing it.",
            success: false
        });
    }

    await Category.findByIdAndDelete(id);
    return res.status(200).json({ message: "delete categories", success: true });
});

export { getAllCategories, createCategory, getSingleCategory, updateCategory, deleteCategory };
