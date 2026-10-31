import { Router } from "express";

import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory} from "../controllers/category.controller.mjs"
import varifytoken from "../midlleware/varifymiddleware.mjs"
import roleMiddleware from "../midlleware/RoleMiddleware.mjs"


const categoryRouter = Router()

categoryRouter.get('/', varifytoken, roleMiddleware('admin', 'customer'), getAllCategories)
categoryRouter.post('/', varifytoken, roleMiddleware('admin'), createCategory)
categoryRouter.get('/:id', varifytoken, roleMiddleware('admin', 'customer'), getSingleCategory)
categoryRouter.put('/:id', varifytoken, roleMiddleware('admin'), updateCategory)
categoryRouter.delete('/:id', varifytoken, roleMiddleware('admin'), deleteCategory)

export default categoryRouter