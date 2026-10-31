import { createproduct, deleteproduct, getAllproducts, getSingleproduct, updateproduct } from "../controllers/product.controller.mjs"
import checkRole from "../midlleware/RoleMiddleware.mjs"
import varifytoken from "../midlleware/varifymiddleware.mjs"
import upload from "../midlleware/uplods.mjs"
import express from "express"


const productRouter = express.Router()

productRouter.get('/',getAllproducts)
productRouter.post('/',varifytoken,checkRole('admin'), upload.single("product_image"), createproduct)

productRouter.get('/:id',getSingleproduct)

productRouter.put('/:id',varifytoken,checkRole('admin'),updateproduct)
productRouter.patch('/:id',varifytoken,checkRole('admin'),updateproduct)
productRouter.delete("/:id", varifytoken,checkRole('admin'),deleteproduct)


export default productRouter