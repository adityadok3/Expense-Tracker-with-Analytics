import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { asyncWrapper } from "../utils/asyncWrapper";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createCategorySchema, updateCategorySchema } from "../validators/categoryValidator";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve user and system default categories
 *     tags: [Categories]
 */
router.get("/", asyncWrapper(CategoryController.getCategories));
router.get("/:id", asyncWrapper(CategoryController.getCategoryById));
router.post("/", validate(createCategorySchema), asyncWrapper(CategoryController.createCategory));
router.put("/:id", validate(updateCategorySchema), asyncWrapper(CategoryController.updateCategory));
router.delete("/:id", asyncWrapper(CategoryController.deleteCategory));

export default router;
