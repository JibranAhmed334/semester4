import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory} from "../controllers/category.controller.mjs"
import varifytoken from "../midlleware/varifymiddleware.mjs"
import roleMiddleware from "../midlleware/RoleMiddleware.mjs"

const categoryRouter = Router()

categoryRouter.get('/', getAllCategories)
categoryRouter.get('/:id', getSingleCategory)
categoryRouter.post('/', varifytoken, roleMiddleware('admin', 'organizer', 'exhibitor'), createCategory)
categoryRouter.put('/:id', varifytoken, roleMiddleware('admin', 'organizer'), updateCategory)
categoryRouter.delete('/:id', varifytoken, roleMiddleware('admin', 'organizer'), deleteCategory)

export default categoryRouter
