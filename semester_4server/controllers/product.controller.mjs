import AsyncHandler from "express-async-handler";
import Product from "../models/product.model .mjs"
import upload_on_cloudinary from "../utils/cloudinary.utils.mjs"
import delete_from_cloudinary from "../utils/cloudinary.delete.utils .mjs"
import mongoose from "mongoose"
import Category from "../models/category.model.mjs"
import fs from "node:fs/promises"
import path from "node:path"
import { uploadDirectory } from "../midlleware/uplods.mjs"

const removeUploadedFile = async (filePath) => {
    try {
        await fs.unlink(filePath)
    } catch (error) {
        if (error.code !== "ENOENT") throw error
    }
}

const getLocalUploadFilename = (imageUrl) => {
    try {
        const pathname = new URL(imageUrl).pathname
        const uploadPrefix = "/uploads/"
        if (!pathname.startsWith(uploadPrefix)) return null

        const filename = decodeURIComponent(pathname.slice(uploadPrefix.length))
        return filename && path.basename(filename) === filename ? filename : null
    } catch {
        return null
    }
}

const getAllproducts = AsyncHandler(async (req, res) => {
    const product = await Product.find().populate("category","category_name")
    const productCount = await Product.countDocuments()
    return res.status(200).json({
        massage: "get all producte",
        success: true,
        productCount,   
        product
    });
});

const createproduct = AsyncHandler(async (req, res) => {
    const { product_name, price, category } = req.body


    if (!product_name?.trim() || !Number.isFinite(Number(price)) || Number(price) <= 0 || !mongoose.isValidObjectId(category)) {
        if (req.file) await removeUploadedFile(req.file.path)
        return res.status(400).json({
            massage: "Provide a product name, positive price, and valid category.",
            success: false
        });
    }

    if (!req.file){
        return res.status(400).json({
            massage:"Please select a product image.",
            success: false
        })
    }

    let categoryExists
    try {
        categoryExists = await Category.exists({ _id: category })
    } catch (error) {
        await removeUploadedFile(req.file.path)
        throw error
    }
    if (!categoryExists) {
        await removeUploadedFile(req.file.path)
        return res.status(400).json({ massage: "The selected category does not exist.", success: false })
    }

    let product_image
    try {
        product_image = await upload_on_cloudinary(req.file.path)
    } catch (error) {
        console.error("Product image upload failed:", error.message)
        const isStaleRequest = /stale request|more than 1 hour ago/i.test(error.message)
        return res.status(502).json({
            massage: isStaleRequest
                ? "Product image upload failed because the server clock is out of sync. Sync the Windows date and time, restart the server, and try again. The local image was kept."
                : "Product image upload failed. Check the Cloudinary server settings and try again. The local image was kept.",
            success: false
        })
    }

    if (!product_image?.secure_url || !product_image?.public_id) {
        return res.status(502).json({
            massage: "Cloudinary did not return an image URL. The local image was kept.",
            success: false
        })
    }

    try {
        await removeUploadedFile(req.file.path)
    } catch (error) {
        console.error("Could not remove successfully uploaded temporary image:", error.message)
        try {
            await delete_from_cloudinary(product_image.public_id)
        } catch (cleanupError) {
            console.error("Could not roll back Cloudinary image after local cleanup failed:", cleanupError.message)
        }
        return res.status(500).json({
            massage: "The image uploaded, but its local temporary file could not be removed. Product was not saved.",
            success: false
        })
    }

    let product
    try {
        product = await Product.create({
            product_name: product_name.trim(),
            price: Number(price),
            category,
            product_image_url: product_image.secure_url,
            product_image_public_id: product_image.public_id
        })
    } catch (error) {
        try {
            await delete_from_cloudinary(product_image.public_id)
        } catch (cleanupError) {
            console.error("Could not remove Cloudinary image after product save failed:", cleanupError.message)
        }
        throw error
    }

    return res.status(201).json({
        massage: "create productes",
        success: true,
        product
    });
});

const getSingleproduct = AsyncHandler(async (req, res) => {
    const {id} =req.params

    const product =await Product.findById(id).populate("category","category_name")
    
 if (!product) {
        return res.status(404).json({
            massage: "product does not exists",
            success: false
        })
 }

    return res.status(200).json({ 
        massage: "get single producte", 
        success: true, 
         product });
});

const updateproduct = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ massage: "Invalid product id.", success: false })
    }

    const { product_name, price, category } = req.body
    if (!product_name?.trim() || !Number.isFinite(Number(price)) || Number(price) <= 0 || !mongoose.isValidObjectId(category)) {
        return res.status(400).json({ massage: "Provide a product name, positive price, and valid category.", success: false })
    }

    const product = await Product.findById(id)
    
 if (!product) {
        return res.status(404).json({
            massage: "product does not exists",
            success: false
        })
 }

    const updatedproduct = await Product.findByIdAndUpdate(
        id,
        { product_name: product_name.trim(), price: Number(price), category },
        { new: true, runValidators: true }
    ).populate("category", "category_name")

    return res.status(200).json({ 
        massage: "update producte", 
        success: true,
        updatedproduct
     });
});

const deleteproduct = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ massage: "Invalid product id.", success: false })
    }

    const product = await Product.findById(id)
    
 if (!product) {
        return res.status(404).json({
            massage: "product does not exists",
            success: false
        })
 }
    await Product.findByIdAndDelete(id)

    let warning
    const localImageFilename = getLocalUploadFilename(product.product_image_url)
    if (localImageFilename) {
        try {
            await fs.unlink(path.join(uploadDirectory, localImageFilename))
        } catch (error) {
            if (error.code !== "ENOENT") {
                console.error(`Could not remove image for deleted product ${id}:`, error.message)
                warning = "The product was deleted, but its image could not be removed from storage."
            }
        }
    } else if (product.product_image_public_id) {
        try {
            await delete_from_cloudinary(product.product_image_public_id)
        } catch (error) {
            console.error(`Could not remove image for deleted product ${id}:`, error.message)
            warning = "The product was deleted, but its image could not be removed from storage."
        }
    }

    return res.status(200).json({ massage: "delete producte", success: true, warning });


});

export { getAllproducts, createproduct, getSingleproduct, updateproduct, deleteproduct };