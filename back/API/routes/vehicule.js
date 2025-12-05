import Router from 'express';
import { getAllVehicules, getVehiculeById, createVehicule, updateVehicule, deleteVehicule } from '../controler/vehicule.js';
import { manager } from '../middleware/auth/mustBe.js';

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

router.get('/', manager, getAllVehicules);
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
router.get('/:id', manager, getVehiculeById);
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
 *             $ref: '#/components/schemas/CreateVehiculeSchema'
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
router.post('/', manager, createVehicule);
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
 *             $ref: '#/components/schemas/UpdateVehiculeSchema'
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

router.patch('/:id', manager, updateVehicule);
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
router.delete('/:id', manager, deleteVehicule);    

export default router;