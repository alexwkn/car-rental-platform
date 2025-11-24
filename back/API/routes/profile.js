import Router from 'express';
import { getAllProfiles, getProfileById, createProfile, updateProfile, deleteProfile } from '../controler/profile.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

/**
 * @swagger
 * /profile:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Profile
 *      responses:
 *          200:
 *              description: List of all profiles
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          500:
 *              description: Server error
 */
router.get('/', manager, getAllProfiles);
/**
 * @swagger
 * /profile/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Profile
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: ID of the profile to retrieve
 *      responses:
 *          200:
 *              description: Profile data
 *          400:
 *              description: Invalid ID
 *          404:
 *              description: Profile not found
 *          500:
 *              description: Server error
 */
router.get('/:id', manager, getProfileById);
/**
 * @swagger
 * /profile:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Profile
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateProfileSchema'
 *      responses:
 *          201:
 *              description: Profile created
 *          400:
 *              description: Validation error
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          500:
 *              description: Server error
 */
router.post('/', manager, createProfile);
/**
 * @swagger
 * /profile/{id}:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Profile
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: ID of the profile to update
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateProfileSchema'
 *      responses:
 *          204:
 *              description: Profile updated
 *          400:
 *              description: Validation error
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          404:
 *              description: Profile not found
 *          500:
 *              description: Server error
 */
router.patch('/:id', manager, updateProfile);
/**
 * @swagger
 * /profile/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Profile
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: ID of the profile to delete
 *      responses:
 *          204:
 *              description: Profile deleted
 *          400:
 *              description: Invalid ID
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Must be manager
 *          404:
 *              description: Profile not found
 *          500:
 *              description: Server error
 */
router.delete('/:id', manager, deleteProfile);

export default router;