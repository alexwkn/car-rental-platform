import Router from 'express';
import { getAllVehicules, getVehiculeById, createVehicule, updateVehicule, deleteVehicule } from '../controler/vehicule.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

/**
 * @swagger
 * /vehicule:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Vehicule
 *     summary: Get all vehicules
 *     responses:
 *       200:
 *         description: List of vehicules
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Must be manager
 *       404:
 *         description: No vehicules found
 *       500:
 *         description: Server error
 */
router.get('/', manager, getAllVehicules);
/**
 * @swagger
 * /vehicule/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Vehicule
 *     summary: Get vehicule by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicule ID
 *     responses:
 *       200:
 *         description: Vehicule found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Must be manager
 *       404:
 *         description: Vehicule not found
 *       500:
 *         description: Server error
 */
router.get('/:id', manager, getVehiculeById);
/**
 * @swagger
 * /vehicule:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Vehicule
 *     summary: Create a new vehicule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVehiculeSchema'
 *     responses:
 *       201:
 *         description: Vehicule created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Must be manager
 *       500:
 *         description: Server error
 */
router.post('/', manager, createVehicule);
/**
 * @swagger
 * /vehicule/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Vehicule
 *     summary: Update vehicule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *         description: Vehicule updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Must be manager
 *       404:
 *         description: Vehicule not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', manager, updateVehicule);
/**
 * @swagger
 * /vehicule/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Vehicule
 *     summary: Delete vehicule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicule deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Must be manager
 *       404:
 *         description: Vehicule not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', manager, deleteVehicule);    

export default router;