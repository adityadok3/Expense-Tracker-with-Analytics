import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { asyncWrapper } from "../utils/asyncWrapper";
import { validate } from "../middleware/validateMiddleware";
import { authenticate } from "../middleware/authMiddleware";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/authValidator";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post("/register", validate(registerSchema), asyncWrapper(AuthController.register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 */
router.post("/login", validate(loginSchema), asyncWrapper(AuthController.login));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT access token
 *     tags: [Auth]
 */
router.post("/refresh", validate(refreshTokenSchema), asyncWrapper(AuthController.refreshTokens));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 */
router.post("/logout", asyncWrapper(AuthController.logout));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user details
 *     tags: [Auth]
 */
router.get("/me", authenticate, asyncWrapper(AuthController.me));

export default router;
