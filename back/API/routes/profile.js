import Router from 'express';
import { getAllProfiles, getProfileById, createProfile, updateProfile, deleteProfile } from '../controler/profile.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

router.get('/', manager, getAllProfiles);
router.get('/:id', manager, getProfileById);
router.post('/', manager, createProfile);
router.patch('/:id', manager, updateProfile);
router.delete('/:id', manager, deleteProfile);

export default router;