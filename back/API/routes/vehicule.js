import Router from "express";
import {
  getAllVehicules,
  getVehiculeById,
  createVehicule,
  updateVehicule,
  deleteVehicule,
  getUserVehicules,
  createVehiculeWithOffer,
  deleteOwnVehicule,
} from "../controler/vehicule.js";
import { manager } from "../middleware/auth/mustBe.js";
import { isOwnVehicule } from "../middleware/auth/isOwner.js";
import { validate } from "../middleware/validator/validate.js";
import { VehiculeValidator } from "../middleware/validator/vehicule.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vehicule
 *   description: Endpoints for managing vehicles (manager only)
 */

/**
 * @swagger
 * /vehicules:
 *   get:
 *     summary: Get all vehicles (manager only)
 *     tags: [Vehicule]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicule'
 *       404:
 *         description: No vehicles found
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /vehicules:
 *   get:
 *     summary: Get all vehicles (manager only)
 *     tags: [Vehicule]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicule'
 *       404:
 *         description: No vehicles found
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */

router.get("/", manager, getAllVehicules);

/**
 * @swagger
 * /vehicules/my:
 *   get:
 *     summary: Get vehicles owned by the authenticated user
 *     tags: [Vehicule]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicule'
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       500:
 *         description: Server error
 */
router.get("/my", getUserVehicules);

/**
 * @swagger
 * /vehicules/with-offer:
 *   post:
 *     summary: Create a vehicle with an offer (authenticated user)
 *     tags: [Vehicule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicule
 *               - offer
 *             properties:
 *               vehicule:
 *                 type: object
 *                 properties:
 *                   model:
 *                     type: string
 *                   licence_plate:
 *                     type: string
 *                   description:
 *                     type: string
 *               offer:
 *                 type: object
 *                 properties:
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   end_date:
 *                     type: string
 *                     format: date
 *                   fuel_level:
 *                     type: number
 *                   adress:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *     responses:
 *       201:
 *         description: Vehicule and offer created successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/with-offer", createVehiculeWithOffer);

/**
 * @swagger
 * /vehicules/{id}:
 *   get:
 *     summary: Get a vehicle by ID (manager only)
 *     tags: [Vehicule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Vehicule ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicule'
 *       404:
 *         description: Vehicle not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.get("/:id", manager, getVehiculeById);
/**
 * @swagger
 * /vehicules:
 *   post:
 *     summary: Create a new vehicle (manager only)
 *     tags: [Vehicule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehiculeSchema'
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Vehicule'
 *       422:
 *         description: Validation error
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.post("/", manager, validate(VehiculeValidator), createVehicule);
/**
 * @swagger
 * /vehicules/{id}:
 *   patch:
 *     summary: Update a vehicle (manager only)
 *     tags: [Vehicule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Vehicule ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehiculeSchema'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Vehicule'
 *       404:
 *         description: Vehicle not found
 *       422:
 *         description: Validation error
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */

router.patch("/:id", manager, updateVehicule);
/**
 * @swagger
 * /vehicules/{id}:
 *   delete:
 *     summary: Delete a vehicle (manager only)
 *     tags: [Vehicule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Vehicule ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.delete("/:id", manager, deleteVehicule);

/**
 * @swagger
 * /vehicules/my/{id}:
 *   delete:
 *     summary: Delete own vehicle (authenticated user)
 *     tags: [Vehicule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Vehicule ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       403:
 *         description: Forbidden — can only delete own vehicles
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.delete("/my/:id", isOwnVehicule, deleteOwnVehicule);

export default router;
