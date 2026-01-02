import Router from 'express';
import { getAllProfiles, getProfileById, createProfile, updateProfile, deleteProfile, uploadProfileImage, deleteProfileImage, deleteMe, changeMyPassword, getMyProfile, uploadMyProfileImage, deleteMyProfileImage   } from '../controler/profile.js';
import { manager } from '../middleware/auth/mustBe.js';
import { upload } from '../middleware/upload/multerConfig.js';
import { checkJWT } from "../middleware/auth/checkJWT.js";




const router = Router();
router.delete("/me", checkJWT, deleteMe);
router.patch("/me/password", changeMyPassword);
router.get("/me", getMyProfile);
router.post("/me/upload-picture", upload.single("profile_picture"), uploadMyProfileImage);
router.delete("/me/picture", deleteMyProfileImage);


/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Endpoints for managing user profiles (manager only)
 */
/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all profiles (manager only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 *       404:
 *         description: No profiles found
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.get('/', manager, getAllProfiles);
/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get a profile by ID (manager only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Profile ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.get('/:id', manager, getProfileById);
/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new profile (manager only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileSchema'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *       422:
 *         description: Validation error
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.post('/', manager, createProfile);
/**
 * @swagger
 * /profiles/{id}:
 *   patch:
 *     summary: Update a profile (manager only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Profile ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileSchema'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
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
router.patch('/:id', manager, updateProfile);
/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     summary: Delete a profile (manager only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Profile ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.delete('/:id', manager, deleteProfile);

router.post('/:id/upload-picture', manager, upload.single('profile_picture'), uploadProfileImage);

/**
 * @swagger
 * /profiles/{id}/upload-picture:
 *   post:
 *     summary: Upload a profile picture (manager only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Profile ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid ID or no image provided
 *       404:
 *         description: Profile not found
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /profiles/{id}/picture:
 *   delete:
 *     summary: Delete profile picture (manager only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Profile ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile picture deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: No profile picture to delete
 *       404:
 *         description: Profile not found
 *       401:
 *         description: Unauthorized — missing or invalid JWT
 *       403:
 *         description: Forbidden — must be manager
 *       500:
 *         description: Server error
 */
router.delete('/:id/picture', manager, deleteProfileImage);

export default router;