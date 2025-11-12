import Router from 'express';
import { getAllVehicules, getVehiculeById, createVehicule, updateVehicule, deleteVehicule } from '../controler/vehicule.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

router.get('/', manager, getAllVehicules);
router.get('/:id', manager, getVehiculeById);
router.post('/', manager, createVehicule);
router.patch('/:id', manager, updateVehicule);
router.delete('/:id', manager, deleteVehicule);    

export default router;